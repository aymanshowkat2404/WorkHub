package com.example.workhub.service;

import com.example.workhub.dto.BulkUploadError;
import com.example.workhub.dto.BulkUploadResult;
import com.example.workhub.dto.EmployeeDto;
import com.example.workhub.exception.ResourceNotFoundException;
import com.example.workhub.model.Employee;
import com.example.workhub.repository.EmployeeRepository;
import com.example.workhub.repository.UserRepository;
import com.example.workhub.util.EmployeeUploadTemplate;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Existing methods remain unchanged
    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return convertToDto(employee);
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        if (employeeRepository.existsByEmail(employeeDto.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        Employee employee = new Employee();
        mapDtoToEntity(employeeDto, employee);
        Employee savedEmployee = employeeRepository.save(employee);
        notifySubscribers();
        return convertToDto(savedEmployee);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        if (!employee.getEmail().equals(employeeDto.getEmail())) {
            if (employeeRepository.existsByEmail(employeeDto.getEmail())) {
                throw new RuntimeException("Email is already in use!");
            }
        }

        mapDtoToEntity(employeeDto, employee);
        Employee updatedEmployee = employeeRepository.save(employee);
        notifySubscribers();
        return convertToDto(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employeeRepository.delete(employee);
        notifySubscribers();
    }

    // New methods for bulk operations
    @Transactional
    public BulkUploadResult processBulkUpload(MultipartFile file) {
        List<BulkUploadError> errors = new ArrayList<>();
        int successCount = 0;
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            
            // Skip header row
            if (rows.hasNext()) rows.next();
            
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                try {
                    EmployeeDto dto = parseEmployeeRow(currentRow);
                    createEmployee(dto);
                    successCount++;
                } catch (Exception e) {
                    errors.add(new BulkUploadError(
                        currentRow.getRowNum() + 1,
                        "All fields",
                        currentRow.toString(),
                        e.getMessage()
                    ));
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to process Excel file: " + e.getMessage());
        }
        
        return new BulkUploadResult(
            successCount + errors.size(),
            successCount,
            errors.size(),
            errors
        );
    }

    public byte[] generateEmployeeTemplate() {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Employee Template");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = EmployeeUploadTemplate.HEADERS;
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }
            
            // Create example data row
            Row exampleRow = sheet.createRow(1);
            String[] exampleData = EmployeeUploadTemplate.EXAMPLE_DATA;
            for (int i = 0; i < exampleData.length; i++) {
                exampleRow.createCell(i).setCellValue(exampleData[i]);
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate template: " + e.getMessage());
        }
    }

    private EmployeeDto parseEmployeeRow(Row row) {
        EmployeeDto dto = new EmployeeDto();
        
        dto.setFirstName(getStringCellValue(row.getCell(0)));
        dto.setLastName(getStringCellValue(row.getCell(1)));
        dto.setEmail(getStringCellValue(row.getCell(2)));
        dto.setPhoneNumber(getStringCellValue(row.getCell(3)));
        dto.setDepartment(getStringCellValue(row.getCell(4)));
        dto.setRole(getStringCellValue(row.getCell(5)));
        dto.setPosition(getStringCellValue(row.getCell(6)));
        Double salaryDouble = getNumericCellValue(row.getCell(7));
        dto.setSalary(salaryDouble != null ? BigDecimal.valueOf(salaryDouble) : null);

        
        String dateString = getStringCellValue(row.getCell(8));
        dto.setHireDate(LocalDate.parse(dateString, DateTimeFormatter.ISO_DATE));
        
        return dto;
    }

    private String getStringCellValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: return String.valueOf(cell.getNumericCellValue());
            default: return null;
        }
    }

    private Double getNumericCellValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case NUMERIC: return cell.getNumericCellValue();
            case STRING: 
                try {
                    return Double.parseDouble(cell.getStringCellValue());
                } catch (NumberFormatException e) {
                    return null;
                }
            default: return null;
        }
    }

    private void notifySubscribers() {
        List<EmployeeDto> employees = getAllEmployees();
        messagingTemplate.convertAndSend("/topic/updates", employees);
    }

    private EmployeeDto convertToDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setDepartment(employee.getDepartment());
        dto.setPosition(employee.getPosition());
        dto.setSalary(employee.getSalary());
        dto.setHireDate(employee.getHireDate());
        dto.setStatus(employee.getStatus());
        dto.setCreatedBy(employee.getCreatedBy() != null ? employee.getCreatedBy().getId() : null);
        return dto;
    }

    private void mapDtoToEntity(EmployeeDto dto, Employee entity) {
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setDepartment(dto.getDepartment());
        entity.setPosition(dto.getPosition());
        entity.setSalary(dto.getSalary());
        entity.setHireDate(dto.getHireDate());
        entity.setStatus(dto.getStatus());
    }
    
    
}