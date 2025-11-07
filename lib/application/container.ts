import { LeadService } from './services/LeadService';
import { NotificationService } from './services/NotificationService';
import { ValidationService } from './services/ValidationService';
import { SupabaseContactRepository } from '../infrastructure/repositories/SupabaseContactRepository';
import { SupabaseOpportunityRepository } from '../infrastructure/repositories/SupabaseOpportunityRepository';
import { IContactRepository } from '../domain/interfaces/IContactRepository';
import { IOpportunityRepository } from '../domain/interfaces/IOpportunityRepository';

/**
 * Dependency Injection Container
 * Manages singleton instances of services and repositories
 */

// Singleton instances
let contactRepository: IContactRepository | null = null;
let opportunityRepository: IOpportunityRepository | null = null;
let leadService: LeadService | null = null;
let notificationService: NotificationService | null = null;
let validationService: ValidationService | null = null;

/**
 * Get or create ContactRepository instance
 */
export function getContactRepository(): IContactRepository {
  if (!contactRepository) {
    contactRepository = new SupabaseContactRepository();
  }
  return contactRepository;
}

/**
 * Get or create OpportunityRepository instance
 */
export function getOpportunityRepository(): IOpportunityRepository {
  if (!opportunityRepository) {
    opportunityRepository = new SupabaseOpportunityRepository();
  }
  return opportunityRepository;
}

/**
 * Get or create LeadService instance with injected dependencies
 */
export function getLeadService(): LeadService {
  if (!leadService) {
    leadService = new LeadService(
      getContactRepository(),
      getOpportunityRepository()
    );
  }
  return leadService;
}

/**
 * Get or create NotificationService instance
 */
export function getNotificationService(): NotificationService {
  if (!notificationService) {
    notificationService = new NotificationService();
  }
  return notificationService;
}

/**
 * Get or create ValidationService instance
 */
export function getValidationService(): ValidationService {
  if (!validationService) {
    validationService = new ValidationService();
  }
  return validationService;
}

/**
 * Reset all singleton instances (useful for testing)
 */
export function resetContainer(): void {
  contactRepository = null;
  opportunityRepository = null;
  leadService = null;
  notificationService = null;
  validationService = null;
}
