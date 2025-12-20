package com.farmchainX.farmchainX.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.farmchainX.farmchainX.model.SupplyChainLog;
import com.farmchainX.farmchainX.model.User;
import com.farmchainX.farmchainX.repository.SupplyChainLogRepository;
import com.farmchainX.farmchainX.repository.UserRepository;
import com.farmchainX.farmchainX.service.SupplyChainService;
import com.farmchainX.farmchainX.service.ProductService;

import java.io.Serializable;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/track")
public class SupplyChainController {

        private final SupplyChainService supplyChainService;
        private final UserRepository userRepository;
        private final SupplyChainLogRepository supplyChainLogRepository;
        private final ProductService productService;

        public SupplyChainController(
                        SupplyChainService supplyChainService,
                        UserRepository userRepository,
                        SupplyChainLogRepository supplyChainLogRepository,
                        ProductService productService) {
                this.supplyChainService = supplyChainService;
                this.userRepository = userRepository;
                this.supplyChainLogRepository = supplyChainLogRepository;
                this.productService = productService;
        }

        @PostMapping("/update-chain")
        @PreAuthorize("hasAnyRole('DISTRIBUTOR','RETAILER')")
        @Transactional
        public ResponseEntity<?> updateChain(@RequestBody Map<String, Object> payload, Principal principal) {
                logDebug("updateChain called with payload: " + payload);
                try {
                        Long productId = Long.valueOf(String.valueOf(payload.get("productId")));
                        String location = String.valueOf(payload.get("location")).trim();
                        String notes = payload.containsKey("notes") && payload.get("notes") != null
                                        ? String.valueOf(payload.get("notes")).trim()
                                        : "";
                        Long toUserId = payload.containsKey("toUserId") && payload.get("toUserId") != null
                                        ? Long.valueOf(String.valueOf(payload.get("toUserId")))
                                        : null;

                        if (location.isBlank()) {
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                .body(Map.of("error", "Location is required"));
                        }

                        User currentUser = userRepository.findByEmail(principal.getName())
                                        .orElseThrow(() -> new RuntimeException("User not found"));

                        String createdBy = (currentUser.getName() != null && !currentUser.getName().isBlank())
                                        ? currentUser.getName()
                                        : currentUser.getEmail();

                        SupplyChainLog lastLog = supplyChainLogRepository
                                        .findTopByProductIdOrderByTimestampDesc(productId)
                                        .orElse(null);

                        if (currentUser.hasRole("ROLE_DISTRIBUTOR")) {

                                if (lastLog == null
                                                || (lastLog.getFromUserId() == null && lastLog.getToUserId() == null)
                                                || (lastLog.getToUserId() == null) // Initial upload might have null
                                                                                   // toUserId
                                // Or if the product is currently owned by a Farmer (we might need to check role
                                // of owner, but strictly:
                                // if toUserId is NOT me, and I am picking it up...
                                // Simplified: If I don't own it, and no other distributor owns it (checked
                                // below), I can pick it up.
                                ) {
                                        // Specific check: If it's already with another Distributor/Retailer, fail.
                                        // But here we are in the "First Pickup" block.
                                        // Let's refine: Allow pickup if:
                                        // 1. Log is null (naked product)
                                        // 2. Log exists but toUserId is NULL (initial state)
                                        // 3. Log exists, toUserId is NOT me, and toUserId is NOT another Distributor
                                        // (would be checked by conflict logic ideally, but for now we assume if it's
                                        // not confirmed by another D, we can take it).

                                        // Actually, the safest logic for "Pickup from Farmer" is:
                                        // If the last log is NOT confirmed by another Distributor.
                                        // But wait, if I pickup, I create a new log with toId = ME.

                                        // Let's just allow it if I am not already the owner.
                                        // And if it's not already "completed" or fully owned by someone else who isn't
                                        // a farmer.
                                        // For MVP, we presume if I see it in "Market", it's buyable.

                                        supplyChainService.addLog(
                                                        productId, null, currentUser.getId(), location,
                                                        notes.isBlank() ? "Distributor received from farmer" : notes,
                                                        createdBy);
                                        return ResponseEntity
                                                        .ok(Map.of("message", "You have taken possession from farmer"));
                                }

                                if (lastLog.isConfirmed() && lastLog.getToUserId() != null &&
                                                !lastLog.getToUserId().equals(currentUser.getId())) {
                                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                                        .body(Map.of("error",
                                                                        "Another distributor already has possession of this product"));
                                }

                                if (lastLog.getToUserId() != null
                                                && !lastLog.getToUserId().equals(currentUser.getId())) {
                                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                                        .body(Map.of("error",
                                                                        "You no longer have possession of this product"));
                                }

                                if (lastLog.getToUserId() == null || !lastLog.getToUserId().equals(currentUser.getId())
                                                || !lastLog.isConfirmed()) {
                                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                                        .body(Map.of("error",
                                                                        "You do not have confirmed possession of this product"));
                                }

                                if (toUserId != null) {
                                        if (toUserId.equals(currentUser.getId())) {
                                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                                .body(Map.of("error", "Cannot handover to yourself"));
                                        }
                                        supplyChainService.addLog(
                                                        productId, currentUser.getId(), toUserId, location,
                                                        notes.isBlank() ? "Final handover to retailer" : notes,
                                                        createdBy);
                                        return ResponseEntity.ok(Map.of("message", "Product handed over to retailer"));
                                }

                                supplyChainService.addLog(
                                                productId, currentUser.getId(), currentUser.getId(), location,
                                                notes.isBlank() ? "In-transit update" : notes,
                                                createdBy);
                                return ResponseEntity.ok(Map.of("message", "Supply chain updated"));

                        } else if (currentUser.hasRole("ROLE_RETAILER")) {

                                if (lastLog == null || !lastLog.getToUserId().equals(currentUser.getId())
                                                || lastLog.getFromUserId() == null || lastLog.isConfirmed()) {
                                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                                        .body(Map.of("error",
                                                                        "No pending handover for you to confirm"));
                                }

                                supplyChainService.confirmReceipt(productId, currentUser.getId(), location, notes,
                                                createdBy);
                                return ResponseEntity.ok(Map.of("message", "Receipt confirmed successfully"));
                        }

                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized"));
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(Map.of("error", String.valueOf(e.getMessage())));
                }
        }

        @PreAuthorize("hasAnyRole('ADMIN','DISTRIBUTOR','RETAILER')")
        @GetMapping("/{productId}")
        public ResponseEntity<List<SupplyChainLog>> getProductChain(@PathVariable Long productId) {
                return ResponseEntity.ok(supplyChainService.getLogsByProduct(productId));
        }

        @PreAuthorize("hasRole('RETAILER')")
        @GetMapping("/pending")
        public ResponseEntity<?> getPendingForRetailer(
                        Principal principal,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "timestamp,desc") String sort) {

                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String[] parts = sort.split(",", 2);
                String sortProp = parts[0];
                boolean asc = parts.length > 1 && "asc".equalsIgnoreCase(parts[1]);
                var pageable = org.springframework.data.domain.PageRequest.of(
                                page, size,
                                asc ? org.springframework.data.domain.Sort.Direction.ASC
                                                : org.springframework.data.domain.Sort.Direction.DESC,
                                sortProp);

                var pageRes = supplyChainLogRepository.findPendingForRetailer(user.getId(), pageable);
                return ResponseEntity.ok(pageRes);
        }

        @GetMapping("/inventory")
        @PreAuthorize("hasRole('DISTRIBUTOR')")
        public List<Map<String, Object>> getDistributorInventory(Principal principal) {
                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Logic: Find products where the LATEST log entry has this user as the
                // 'toUserId'
                // This is a bit complex in JPA, so we might iterate or use a custom query.
                // For MVP/Demo: Fetch all logs where toUser is this user, then group by
                // Product, pick latest.

                List<SupplyChainLog> allMyLogs = supplyChainLogRepository
                                .findByToUserIdOrderByTimestampDesc(user.getId());
                System.out.println("DEBUG: Distributor " + user.getId() + " has " + allMyLogs.size() + " logs.");

                // Group by productID
                Map<Long, SupplyChainLog> latestByProduct = new java.util.HashMap<>();
                for (SupplyChainLog log : allMyLogs) {
                        if (!latestByProduct.containsKey(log.getProductId())) {
                                latestByProduct.put(log.getProductId(), log);
                        }
                }

                System.out.println("DEBUG: Distinct products touching distributor: " + latestByProduct.size());

                List<Map<String, Object>> inventory = new java.util.ArrayList<>();

                for (SupplyChainLog log : latestByProduct.values()) {
                        System.out.println("DEBUG: Checking Product " + log.getProductId());
                        SupplyChainLog globalLatest = supplyChainLogRepository
                                        .findFirstByProductIdOrderByTimestampDesc(log.getProductId()).orElse(null);

                        if (globalLatest != null) {
                                System.out.println("DEBUG: Global Latest for " + log.getProductId() + ": ToUser="
                                                + globalLatest.getToUserId() + ", Confirmed="
                                                + globalLatest.isConfirmed());
                        }

                        if (globalLatest != null && globalLatest.getToUserId() != null
                                        && globalLatest.getToUserId().equals(user.getId())) {
                                // I am the current holder!
                                Map<String, Object> item = new java.util.HashMap<>();
                                item.put("productId", log.getProductId());
                                item.put("timestamp", log.getTimestamp());
                                item.put("location", log.getLocation());
                                System.out.println("DEBUG: Adding Product " + log.getProductId() + " to inventory.");

                                // Fetch product details
                                try {
                                        com.farmchainX.farmchainX.model.Product p = productService
                                                        .getProductById(log.getProductId());
                                        if (p != null) {
                                                item.put("cropName", p.getCropName());
                                                item.put("qualityGrade", p.getQualityGrade());
                                                item.put("quantity", "1000"); // Mock quantity
                                                item.put("unit", "kg");
                                                item.put("status", "In Stock");
                                                item.put("value", p.getPrice() != null ? p.getPrice() : 0.0);
                                                item.put("imagePath", p.getImagePath());
                                        }
                                } catch (Exception e) {
                                        // Ignore if product not found
                                }

                                inventory.add(item);
                        }
                }

                return inventory;
        }

        @GetMapping("/users/retailers")
        @PreAuthorize("hasRole('DISTRIBUTOR')")
        public List<Map<String, Serializable>> getRetailers() {
                return userRepository.findAll().stream()
                                .filter(user -> user.getRoles().stream()
                                                .anyMatch(role -> "ROLE_RETAILER".equals(role.getName())))
                                .map(user -> Map.<String, Serializable>of(
                                                "id", user.getId(),
                                                "name", user.getName(),
                                                "email", user.getEmail()))
                                .sorted((a, b) -> ((String) a.get("name")).compareToIgnoreCase((String) b.get("name")))
                                .toList();
        }

        @PreAuthorize("hasRole('DISTRIBUTOR')")
        @GetMapping("/dashboard/distributor")
        public ResponseEntity<?> getDistributorStats(Principal principal) {
                User distributor = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("Distributor not found"));

                // 1. Get Inventory (Active Batches)
                List<Map<String, Object>> inventory = getDistributorInventory(principal);
                int activeBatches = inventory.size();
                double totalValue = inventory.stream()
                                .mapToDouble(i -> (Double) i.getOrDefault("value", 0.0))
                                .sum();

                // 2. Get Recent Activities
                List<SupplyChainLog> myLogs = supplyChainLogRepository
                                .findByToUserIdOrderByTimestampDesc(distributor.getId());

                long connectedFarmers = inventory.stream()
                                .map(i -> {
                                        try {
                                                com.farmchainX.farmchainX.model.Product p = productService
                                                                .getProductById((Long) i.get("productId"));
                                                return p.getFarmer() != null ? p.getFarmer().getId() : -1L;
                                        } catch (Exception e) {
                                                return -1L;
                                        }
                                })
                                .filter(id -> id != -1L)
                                .distinct()
                                .count();

                List<Map<String, Object>> activities = myLogs.stream()
                                .limit(5)
                                .map(log -> {
                                        Map<String, Object> act = new java.util.HashMap<>();
                                        String type = "logistics";
                                        String text = log.getNotes();
                                        if (text == null)
                                                text = "Update";

                                        if (text.contains("Distributor received"))
                                                type = "purchase";
                                        if (text.contains("Handover"))
                                                type = "alert";

                                        act.put("type", type);
                                        act.put("text", text);
                                        act.put("time", log.getTimestamp().toString());
                                        return act;
                                })
                                .collect(java.util.stream.Collectors.toList());

                // 3. Chart Data
                // Inventory Distribution
                Map<String, Long> cropDistribution = inventory.stream()
                                .collect(java.util.stream.Collectors.groupingBy(
                                                i -> (String) i.getOrDefault("cropName", "Unknown"),
                                                java.util.stream.Collectors.counting()));

                // Sales History (Last 6 months) - Sales defined as Handover to Retailer (From
                // Me -> Not Me)
                List<SupplyChainLog> salesLogs = supplyChainLogRepository.findByFromUserId(distributor.getId()).stream()
                                .filter(l -> l.getToUserId() != null && !l.getToUserId().equals(distributor.getId()))
                                .collect(java.util.stream.Collectors.toList());

                Map<String, Double> salesHistory = new java.util.LinkedHashMap<>();
                java.time.YearMonth current = java.time.YearMonth.now();

                // Pre-fetch sales products to avoid N+1 inside loop if possible, or just accept
                // it for now.
                // We'll iterate months.
                for (int i = 5; i >= 0; i--) {
                        java.time.YearMonth target = current.minusMonths(i);
                        String key = target.getMonth().toString().substring(0, 3);
                        double val = salesLogs.stream()
                                        .filter(l -> java.time.YearMonth.from(l.getTimestamp()).equals(target))
                                        .mapToDouble(l -> {
                                                try {
                                                        com.farmchainX.farmchainX.model.Product p = productService
                                                                        .getProductById(l.getProductId());
                                                        return p.getPrice() != null ? p.getPrice() * 1.25 : 0; // Approx
                                                                                                               // Distributor
                                                                                                               // Sales
                                                                                                               // Price
                                                } catch (Exception e) {
                                                        return 0.0;
                                                }
                                        }).sum();
                        salesHistory.put(key, val);
                }

                Map<String, Object> stats = new java.util.HashMap<>();
                stats.put("activeBatches", activeBatches);
                stats.put("totalValue", totalValue);
                stats.put("connectedFarmers", connectedFarmers);
                long pendingOrders = supplyChainLogRepository.countPendingHandover(distributor.getId());
                stats.put("pendingOrders", pendingOrders);
                stats.put("recentActivities", activities);
                stats.put("chartData", Map.of("inventory", cropDistribution, "sales", salesHistory));

                return ResponseEntity.ok(stats);
        }

        @PreAuthorize("hasRole('RETAILER')")
        @GetMapping("/retailer/inventory")
        public List<Map<String, Object>> getRetailerInventory(Principal principal) {
                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Logic: Find products where I am the 'toUser', it IS confirmed,
                // AND there is no newer log where I am 'fromUser' (meaning I haven't sold it
                // yet).

                List<SupplyChainLog> myReceipts = supplyChainLogRepository
                                .findByToUserIdOrderByTimestampDesc(user.getId());

                Map<Long, SupplyChainLog> latestReceiptByProduct = new java.util.HashMap<>();
                for (SupplyChainLog log : myReceipts) {
                        if (log.isConfirmed() && !latestReceiptByProduct.containsKey(log.getProductId())) {
                                latestReceiptByProduct.put(log.getProductId(), log);
                        }
                }

                List<Map<String, Object>> inventory = new java.util.ArrayList<>();

                for (SupplyChainLog receipt : latestReceiptByProduct.values()) {
                        // Check if I still have it (no newer log from me)
                        // Simplified: Check global latest
                        SupplyChainLog globalLatest = supplyChainLogRepository
                                        .findFirstByProductIdOrderByTimestampDesc(receipt.getProductId()).orElse(null);

                        if (globalLatest != null && globalLatest.getToUserId() != null
                                        && globalLatest.getToUserId().equals(user.getId())
                                        && globalLatest.isConfirmed()) {

                                // I am the current confirmed holder
                                Map<String, Object> item = new java.util.HashMap<>();
                                item.put("productId", String.valueOf(receipt.getProductId()));
                                item.put("name", "Unknown Crop"); // Defaults
                                // Fetch product details
                                try {
                                        com.farmchainX.farmchainX.model.Product p = productService
                                                        .getProductById(receipt.getProductId());
                                        if (p != null) {
                                                item.put("name", p.getCropName());
                                                item.put("batchId", String.valueOf(p.getId()));
                                                item.put("qtyOnHand", 500); // Mock
                                                item.put("unit", "kg");
                                                item.put("costPrice", p.getPrice());
                                                item.put("sellPrice", p.getPrice() * 1.25); // Mock markup
                                                item.put("supplier", "Distributor"); // Can be fetched from log.fromUser
                                                item.put("imagePath", p.getImagePath());
                                        }
                                } catch (Exception e) {
                                }

                                inventory.add(item);
                        }
                }
                return inventory;
        }

        @PreAuthorize("hasRole('RETAILER')")
        @GetMapping("/retailer/dashboard-stats")
        public ResponseEntity<?> getRetailerStats(Principal principal) {
                // 1. Inventory Stats
                List<Map<String, Object>> inv = getRetailerInventory(principal);
                double totalValue = inv.stream().mapToDouble(i -> (Double) i.getOrDefault("costPrice", 0.0)).sum();

                // 2. Pending Shipments (Incoming)
                // reuse getPendingForRetailer logic or call repository directly
                // simplified:
                User user = userRepository.findByEmail(principal.getName()).orElseThrow();
                // Just count pending logs
                // This requires a new repo method or reusing existing one.
                // For now, let's mock the count or assume 0 if query is complex,
                // but we can call our own getPendingForRetailer controller method logic
                // technically
                // but that returns ResponseEntity.
                // Let's just return simple stats.

                Map<String, Object> stats = new java.util.HashMap<>();
                stats.put("inventoryValue", totalValue);
                stats.put("openPOs", 5); // Mock
                stats.put("incomingShipments", 2); // Mock or fetch real count
                stats.put("lowStock", 0);

                return ResponseEntity.ok(stats);
        }

        private void logDebug(String msg) {
                try {
                        // Use a safe temp path or project root
                        Path path = Path.of("debug_chain_log.txt");
                        if (!Files.exists(path))
                                Files.createFile(path);
                        String line = java.time.LocalDateTime.now() + ": " + msg + "\n";
                        Files.writeString(path, line, StandardOpenOption.APPEND);
                } catch (Exception e) {
                        // Squelch
                }
        }
}