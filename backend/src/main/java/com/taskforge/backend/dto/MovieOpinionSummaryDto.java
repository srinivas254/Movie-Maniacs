package com.taskforge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieOpinionSummaryDto {

    private long totalVotes;

    private long skipVotes;
    private long timePassVotes;
    private long goForItVotes;
    private long perfectionVotes;

    private double skipPercentage;
    private double timePassPercentage;
    private double goForItPercentage;
    private double perfectionPercentage;
}
