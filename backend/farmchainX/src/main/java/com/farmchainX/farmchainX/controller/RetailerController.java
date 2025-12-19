package com.farmchainX.farmchainX.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmchainX.farmchainX.model.Order;
import com.farmchainX.farmchainX.model.User;
import com.farmchainX.farmchainX.repository.OrderRepository;
import com.farmchainX.farmchainX.repository.SupplyChainLogRepository;
import com.farmchainX.farmchainX.repository.UserRepository;
import com.farmchainX.farmchainX.repository.ProductRepository;
import com.farmchainX.farmchainX.model.SupplyChainLog;
import com.farmchainX.farmchainX.model.Product;

@RestController
@RequestMapping("/api/retailer")
@PreAuthorize("hasRole('RETAILER')")
public class RetailerController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final SupplyChainLogRepository supplyChainLogRepository;
    private final ProductRepository productRepository;

    public RetailerController(UserRepository userRepository, OrderRepository orderRepository,
            SupplyChainLogRepository supplyChainLogRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.supplyChainLogRepository = supplyChainLogRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Long retailerId = user.getId();

        // 1. Inventory Value (Mock calculation: Count confirmed items * avg price)
        // Real implementation would join Product table and sum prices
        long confirmedItems = supplyChainLogRepository.countConfirmedByToUserId(retailerId);
        double inventoryValue = confirmedItems * 500.0; // Assuming avg 500 per item for now

        // 2. Open POs (Status != Delivered)
        long openPOs = orderRepository.countByRetailerIdAndStatusNot(retailerId, "Delivered");

        // 3. Incoming Shipments (Pending confirmations)
        long incoming = supplyChainLogRepository.countPendingForRetailer(retailerId);

        // 4. Low Stock (Mock: Random or based on logic)
        long lowStock = 2;

        Map<String, Object> stats = new HashMap<>();
        stats.put("inventoryValue", inventoryValue);
        stats.put("openPOs", openPOs);
        stats.put("incomingShipments", incoming);
        stats.put("lowStock", lowStock);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getRecentOrders(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        // Get top 5 recent orders
        return ResponseEntity
                .ok(orderRepository.findByRetailerIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(0, 5)));
    }

    @GetMapping("/sales-chart")
    public ResponseEntity<?> getSalesChartData() {
        // Mock data for chart
        Map<String, Object> data = new HashMap<>();
        data.put("labels", List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"));
        data.put("values", List.of(150, 230, 180, 320, 290, 450, 410));
        return ResponseEntity.ok(data);
    }

    @GetMapping("/inventory")
    public ResponseEntity<?> getInventory(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        // Fetch logs confirmed by retailer
        List<SupplyChainLog> logs = supplyChainLogRepository.findByToUserIdAndConfirmedTrue(user.getId());

        // Group/Map to DTO
        List<Map<String, Object>> inventory = logs.stream().map(log -> {
            Product p = productRepository.findById(log.getProductId()).orElse(null);
            Map<String, Object> item = new HashMap<>();
            if (p != null) {
                item.put("productId", p.getPublicUuid());
                item.put("name", p.getCropName());
                item.put("batchId", "BATCH-" + p.getId()); // Mock batch ID
                item.put("qtyOnHand", 100); // Mock quantity as logic is missing
                item.put("unit", "kg");
                item.put("costPrice", 40); // Mock
                item.put("sellPrice", 60); // Mock
                item.put("expiryDate", p.getHarvestDate().plusDays(10)); // Mock logic
                item.put("supplier", log.getCreatedBy()); // Approximate supplier
            }
            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/shipments")
    public ResponseEntity<?> getShipments(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<SupplyChainLog> logs = supplyChainLogRepository.findByToUserIdOrderByTimestampDesc(user.getId());

        List<Map<String, Object>> shipments = logs.stream().map(log -> {
            Map<String, Object> s = new HashMap<>();
            s.put("id", "SHIP-" + log.getId());
            s.put("carrier", "AgriLogistics"); // Mock
            s.put("eta", log.getTimestamp().plusDays(2));
            s.put("status", log.isConfirmed() ? "Delivered" : "In Transit");
            s.put("items", 1); // Single product per log usually
            return s;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/orders/all")
    public ResponseEntity<List<Order>> getAllOrders(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(orderRepository.findByRetailerIdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/provenance/{uuid}")
    public ResponseEntity<?> getProvenanceByUuid(@PathVariable String uuid) {
        Product product = productRepository.findByPublicUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<SupplyChainLog> logs = supplyChainLogRepository.findByProductIdOrderByTimestampAsc(product.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("product", product);
        result.put("chain", logs);

        return ResponseEntity.ok(result);
    }
}
