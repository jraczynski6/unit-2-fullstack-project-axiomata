package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import org.springframework.stereotype.Service;

@Service
public class CulturalPassService {

    public ProtoWorldDto apply(ProtoWorldDto proto) {
        // TODO: populate proto.attributes with cultural info (for MVP, mostly worldName pool)
        return proto;
    }
}