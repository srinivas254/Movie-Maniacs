package com.taskforge.backend.service;

import com.taskforge.backend.config.JwtUtil;
import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.AuthProvider;
import com.taskforge.backend.entity.User;
import com.taskforge.backend.exception.*;
import com.taskforge.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import static com.taskforge.backend.entity.Role.USER;

@Service
public class AuthServiceImpl implements AuthService{
    private final GoogleAuthService googleAuthService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final Map<String,OtpEntry> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    public AuthServiceImpl(GoogleAuthService googleAuthService,UserRepository userRepository,JwtUtil jwtUtil, ModelMapper modelMapper, PasswordEncoder passwordEncoder, MailService mailService){
        this.googleAuthService = googleAuthService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    @Override
    public UserRegistrationResponseDto saveUser(UserRegistrationRequestDto user){
        User euser = new User();
        modelMapper.map(user,euser);
        euser.setProvider(AuthProvider.LOCAL);
        euser.setPassword(passwordEncoder.encode(euser.getPassword()));
        euser.setRole(USER);
        User saved = userRepository.save(euser);
        return UserRegistrationResponseDto.builder()
                .message("User registration successful")
                .id(saved.getId())
                .build();
    }

    @Override
    public OtpGenerationResponseDto loginAUser(OtpGenerationRequestDto userLoginRequestDto){
        String emailOrUserName = userLoginRequestDto.getEmailOrUserName();
        String providedPass = userLoginRequestDto.getPassword();
        User userLogin;

        if(emailOrUserName.contains("@")){
            userLogin = userRepository.findByEmail(emailOrUserName)
                    .orElseThrow(()-> new UserNotFoundException("User not found with email: "+ emailOrUserName));
        }else {
            userLogin = userRepository.findByUserName(emailOrUserName)
                    .orElseThrow(() -> new UserNotFoundException("User not found with username: "+ emailOrUserName));
        }

        if(!passwordEncoder.matches(providedPass,userLogin.getPassword())){
            throw new InvalidPasswordException("Entered password is incorrect");
        }

        String otp;
        long expiryTime = System.currentTimeMillis() + 2*60*1000;

        otp = String.valueOf(100000 + new Random().nextInt(900000));

        mailService.sendMail(userLogin.getEmail(),
                "OTP for login to Movie Maniacs",
                "<p>OTP sent for the login is <b>" + otp + "</b>. It is valid for <b>2</b> minutes</p>");

        OtpEntry otpEntry = new OtpEntry(otp, expiryTime, userLogin.getId());
        otpStorage.put(userLogin.getId(), otpEntry);

        return OtpGenerationResponseDto.builder()
                .message("OTP sent successfully")
                .id(userLogin.getId())
                .build();
    }

    @Override
    public LoginResponseDto verifyAOtp(OtpVerificationRequestDto otpVerificationRequestDto){
        OtpEntry entry = otpStorage.get(otpVerificationRequestDto.getId());

        if(entry == null){
            throw new OtpNotFoundException("OTP expired or not found");
        }

        if(System.currentTimeMillis() > entry.getExpiryTime()){
            otpStorage.remove(otpVerificationRequestDto.getId());
            throw new OtpExpiredException("OTP expired");
        }

        if(!entry.getOtp().equals(otpVerificationRequestDto.getOtp())){
            throw new InvalidOtpException("Invalid OTP");
        }

        otpStorage.remove(otpVerificationRequestDto.getId());

        User userLogin = userRepository.findById(otpVerificationRequestDto.getId())
         .orElseThrow(() -> new UserNotFoundException("User not found with id "+ otpVerificationRequestDto.getId()));

        String jwtToken = jwtUtil.generateToken(userLogin.getId(), userLogin.getUserName(), userLogin.getRole());

        return LoginResponseDto.builder()
                .message("Jwt Login successful")
                .id(userLogin.getId())
                .token(jwtToken)
                .build();
    }

    @Override
    public String redirectToGoogle(){
        return googleAuthService.buildAuthUrl();
    }

    private User handleEmailBasedFlow(String sub,String name,String email,String pictureUrl){
        return userRepository.findByEmail(email).map(
                existingUser -> {
                    existingUser.setProviderId(sub);
                    existingUser.setPictureUrl(pictureUrl);
                    return userRepository.save(existingUser);
                }
        ).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setProvider(AuthProvider.GOOGLE);
                    newUser.setProviderId(sub);
                    newUser.setUserName(UserNameGenerator.generate(name));
                    newUser.setPassword(null);
                    newUser.setName(name);
                    newUser.setEmail(email);
                    newUser.setPictureUrl(pictureUrl);
                    newUser.setRole(USER);
                    return userRepository.save(newUser);
                }
        );
    }

    @Override
    public LoginResponseDto loginWithGoogle(String code) {
        Map<String,Object> tokens = googleAuthService.exchangeCodeForTokens(code);
        Map<String, Object> claims = googleAuthService.parseIdToken((String) tokens.get("id_token"));

        String sub = (String) claims.get("sub");
        String name = (String) claims.get("name");
        String email = (String) claims.get("email");
        String pictureUrl = (String) claims.get("picture");

        User user = userRepository.findByProviderId(sub)
                .orElseGet(()-> handleEmailBasedFlow(sub,name,email,pictureUrl));


        String googleAuthToken = jwtUtil.generateToken(user.getId(), user.getUserName(), user.getRole());
        return LoginResponseDto.builder()
                .message("Google oAuth Login successful")
                .id(user.getId())
                .token(googleAuthToken)
                .build();
    }
}
