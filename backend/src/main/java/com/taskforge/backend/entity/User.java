package com.taskforge.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true)
    private String userName;
    private String name;

    @Column(unique = true)
    private String email;

    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;

    private String bio;

    private int followersCount;
    private int followingCount;

    private String provider;
    private String providerId;
    private String pictureUrl;

    @Embedded
    private SocialLinks socialLinks;
}

