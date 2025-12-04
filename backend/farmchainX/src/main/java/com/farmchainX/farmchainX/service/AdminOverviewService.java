package com.farmchainX.farmchainX.service;

import org.springframework.stereotype.Service;

import com.farmchainX.farmchainX.dto.AdminOverview;
import com.farmchainX.farmchainX.repository.FeedbackRepository;
import com.farmchainX.farmchainX.repository.ProductRepository;
import com.farmchainX.farmchainX.repository.SupplyChainLogRepository;
import com.farmchainX.farmchainX.repository.UserRepository;

@Service
public class AdminOverviewService {

	private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final SupplyChainLogRepository supplyChainLogRepo;
    private final FeedbackRepository feedbackRepo;

    public AdminOverviewService(UserRepository userRepo,
                                ProductRepository productRepo,
                                SupplyChainLogRepository supplyChainLogRepo,
                                FeedbackRepository feedbackRepo) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.supplyChainLogRepo = supplyChainLogRepo;
        this.feedbackRepo = feedbackRepo;
    }

    public AdminOverview getOverview() {
    	return new AdminOverview(
    			userRepo.count(),
    			productRepo.count(),
    			supplyChainLogRepo.count(),
    			feedbackRepo.count());
    }

}