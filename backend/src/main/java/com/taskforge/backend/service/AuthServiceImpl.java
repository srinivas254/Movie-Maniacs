package com.taskforge.backend.service;

import com.taskforge.backend.config.JwtUtil;
import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.AuthProvider;
import com.taskforge.backend.entity.PasswordResetToken;
import com.taskforge.backend.entity.User;
import com.taskforge.backend.exception.*;
import com.taskforge.backend.repository.PasswordResetTokenRepository;
import com.taskforge.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
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
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final Map<String,OtpEntry> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    public AuthServiceImpl(GoogleAuthService googleAuthService,UserRepository userRepository,JwtUtil jwtUtil, ModelMapper modelMapper, PasswordEncoder passwordEncoder, MailService mailService,PasswordResetTokenRepository passwordResetTokenRepository){
        this.googleAuthService = googleAuthService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.mailService = mailService;
    }

    @Override
    public MsgResponseDto saveUser(UserRegistrationRequestDto user){
        User euser = new User();
        modelMapper.map(user,euser);
        euser.setProvider(AuthProvider.LOCAL);
        euser.setPassword(passwordEncoder.encode(euser.getPassword()));
        euser.setRole(USER);
        userRepository.save(euser);
        return MsgResponseDto.builder()
                .message("User registration successful")
                .build();
    }

    @Override
    public MsgResponseDto loginAUser(OtpGenerationRequestDto userLoginRequestDto){
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

        return MsgResponseDto.builder()
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
                throw new UserNotFoundException(
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
    public  void registerWithGoogle(String code) {

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
            throw new UserAlreadyExistsException(
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
    }

    @Override
    public boolean checkUserName(String userName){
        return userRepository.existsByUserName(userName);
    }

    @Override
    public boolean checkEmail(String email){
        return userRepository.existsByEmail(email);
    }

    @Override
    public MsgResponseDto forgotPassword(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            throw new UserNotFoundException("User not found with email "+ email);
        }

        passwordResetTokenRepository
                .deleteByUsedTrueOrExpiresAtBefore(LocalDateTime.now());

        String rawToken = UUID.randomUUID().toString();
        System.out.println("rawToken : "+ rawToken);
        String hashedToken = passwordEncoder.encode(rawToken);

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setTokenHash(hashedToken);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        token.setUsed(false);

        passwordResetTokenRepository.save(token);

        String resetLink =
                "http://localhost:5173/reset-password?rawToken=" + rawToken;

        String subject = "Reset your password";

        String body =
                "<p>Hello,</p>" +
                        "<p>You requested to reset your password.</p>" +
                        "<p>Click the link below to reset it (valid for <b>15</b> minutes):</p>" +
                        "<p><a href=\"" + resetLink + "\">Reset Password</a></p>";


        mailService.sendMail(
                user.getEmail(),
                subject,
                body
        );

        return MsgResponseDto.builder()
                .message("Mail sent successfully")
                .build();
    }

    @Override
    public MsgResponseDto resetPassword(String rawToken,
                              String newPassword,
                              String confirmPassword) {

        if (!newPassword.equals(confirmPassword)) {
            throw new ConfirmPasswordMismatchException("New Password and confirm password does not match");
        }

        // find user by valid token
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByUsedFalseAndExpiresAtAfter(LocalDateTime.now())
                .stream()
                .filter(t ->
                        !t.isUsed()
                                && t.getExpiresAt().isAfter(LocalDateTime.now())
                                && passwordEncoder.matches(rawToken, t.getTokenHash()))
                .findFirst()
                .orElseThrow(() ->
                        new InvalidIdTokenException("Invalid or expired token")
                );

        User user = resetToken.getUser();

        PasswordResetToken latestToken =
                passwordResetTokenRepository
                        .findTopByUserAndUsedFalseAndExpiresAtAfterOrderByExpiresAtDesc(
                                user, LocalDateTime.now()
                        )
                        .orElseThrow(() ->
                                new InvalidIdTokenException("Invalid or expired token")
                        );

        // Step 3: ensure user is using the latest token
        if (!latestToken.getId().equals(resetToken.getId())) {
            throw new InvalidIdTokenException("Please use the latest reset link");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new PasswordAlreadyExistsException(
                    "New password must be different from old password"
            );
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return MsgResponseDto.builder()
                .message("Password reset successful")
                .build();
    }

}
