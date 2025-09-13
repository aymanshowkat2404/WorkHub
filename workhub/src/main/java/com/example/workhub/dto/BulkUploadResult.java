package com.example.workhub.dto;

import java.util.List;

import lombok.Data;
@Data
public class BulkUploadResult {
    private int totalRecords;
    private int successCount;
    private int failureCount;
    private List<BulkUploadError> errors;

    // Constructors
    public BulkUploadResult() {
    }

    public BulkUploadResult(int totalRecords, int successCount, int failureCount, List<BulkUploadError> errors) {
        this.totalRecords = totalRecords;
        this.successCount = successCount;
        this.failureCount = failureCount;
        this.errors = errors;
    }

    // Getters and Setters
    public int getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }

    public int getFailureCount() {
        return failureCount;
    }

    public void setFailureCount(int failureCount) {
        this.failureCount = failureCount;
    }

    public List<BulkUploadError> getErrors() {
        return errors;
    }

    public void setErrors(List<BulkUploadError> errors) {
        this.errors = errors;
    }
}