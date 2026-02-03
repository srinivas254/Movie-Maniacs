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
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import static com.taskforge.backend.entity.Role.USER;

@Service
@Transactional
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
        userRepository.save(euser);
        return UserRegistrationResponseDto.builder()
                .message("User registration successful")
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

        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        long expiryTime = System.currentTimeMillis() + 2*60*1000;

        mailService.sendMail(userLogin.getEmail(),
                "OTP for login to Movie Maniacs",
                "<p>OTP sent for the login is <b>" + otp + "</b>. It is valid for <b>2</b> minutes</p>");

        OtpEntry otpEntry = new OtpEntry(otp, expiryTime, userLogin.getId());
        otpStorage.put(otp, otpEntry);

        return OtpGenerationResponseDto.builder()
                .message("OTP sent successfully")
                .build();
    }

    @Override
    public LoginResponseDto verifyAOtp(OtpVerificationRequestDto otpVerificationRequestDto){
        OtpEntry entry = otpStorage.get(otpVerificationRequestDto.getOtp());

        if(entry == null){
            throw new OtpNotFoundException("OTP expired or not found");
        }

        if(System.currentTimeMillis() > entry.getExpiryTime()){
            otpStorage.remove(otpVerificationRequestDto.getOtp());
            throw new OtpExpiredException("OTP expired");
        }

        if(!entry.getOtp().equals(otpVerificationRequestDto.getOtp())){
            throw new InvalidOtpException("Invalid OTP");
        }

        String id = entry.getId();
        otpStorage.remove(otpVerificationRequestDto.getOtp());

        User userLogin = userRepository.findById(id)
         .orElseThrow(() -> new UserNotFoundException("User not found with id "+ id));

        String jwtToken = jwtUtil.generateToken(userLogin.getId(), userLogin.getRole());

        return LoginResponseDto.builder()
                .message("Jwt Login successful")
                .token(jwtToken)
                .build();
    }

    @Override
    public String redirectToGoogle(String state){
        return googleAuthService.buildAuthUrl(state);
    }

    @Override
    public LoginResponseDto loginWithGoogle(String code) {
        Map<String,Object> tokens = googleAuthService.exchangeCodeForTokens(code);
        Map<String, Object> claims = googleAuthService.parseIdToken((String) tokens.get("id_token"));

        String sub = (String) claims.get("sub");
        String email = (String) claims.get("email");
        String pictureUrl = (String) claims.get("picture");

        User user = userRepository.findByProviderId(sub).orElse(null);

        // 2) If not found, try by email
        if (user == null) {
            user = userRepository.findByEmail(email).orElse(null);

            // 3) If email exists -> link Google
            if (user != null) {
                user.setProvider(AuthProvider.GOOGLE);
                user.setProviderId(sub);
                user.setPictureUrl(pictureUrl);
                userRepository.save(user);
            }

            else {
                throw new RuntimeException(
                        "Account not found. Please register first."
                );
            }
        }

            String googleAuthToken = jwtUtil.generateToken(user.getId(),user.getRole());
        return LoginResponseDto.builder()
                .message("Google oAuth Login successful")
                .token(googleAuthToken)
                .build();
    }

    @Override
    public  UserRegistrationResponseDto registerWithGoogle(String code) {

        Map<String,Object> tokens =
                googleAuthService.exchangeCodeForTokens(code);

        Map<String,Object> claims =
                googleAuthService.parseIdToken(
                        (String) tokens.get("id_token")
                );

        String sub = (String) claims.get("sub");
        String name = (String) claims.get("name");
        String email = (String) claims.get("email");
        String pictureUrl = (String) claims.get("picture");

        if(userRepository.findByEmail(email).isPresent()){
            throw new RuntimeException(
                    "Account already exists. Please login."
            );
        }

        User newUser = new User();
        newUser.setProvider(AuthProvider.GOOGLE);
        newUser.setProviderId(sub);
        newUser.setUserName(UserNameGenerator.generate(name));
        newUser.setPassword(null);
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPictureUrl(pictureUrl);
        newUser.setRole(USER);

        userRepository.save(newUser);

        return UserRegistrationResponseDto.builder()
                .message("Google Registration successful")
                .build();
    }

    @Override
    public boolean checkUserName(String userName){
        return userRepository.existsByUserName(userName);
    }

    @Override
    public boolean checkEmail(String email){
        return userRepository.existsByEmail(email);
    }
}
