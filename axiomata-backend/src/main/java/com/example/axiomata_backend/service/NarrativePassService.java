package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import org.springframework.stereotype.Service;

@Service
public class NarrativePassService {

    public ProtoWorldDto apply(ProtoWorldDto proto) {
        // TODO: generate final description using proto.attributes
        return proto;
    }
}