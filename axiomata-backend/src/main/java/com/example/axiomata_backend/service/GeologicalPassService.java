package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import org.springframework.stereotype.Service;

@Service
public class GeologicalPassService {

    public ProtoWorldDto apply(ProtoWorldDto proto) {
        // TODO: populate proto.attributes with geological info (worldSize, tectonicActivity, resource)
        return proto;
    }
}