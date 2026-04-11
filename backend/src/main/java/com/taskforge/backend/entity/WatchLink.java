package com.taskforge.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "watch_link")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchLink{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String platform;

    @Column(nullable = false)
    private String accessType;
}
