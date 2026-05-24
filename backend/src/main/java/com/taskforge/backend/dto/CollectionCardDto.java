package com.taskforge.backend.dto;

import com.taskforge.backend.entity.Visibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionCardDto {
    private Long id;
    private String name;
    private Visibility visibility;
    private int itemsCount;
}
