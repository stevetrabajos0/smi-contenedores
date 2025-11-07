import { Opportunity } from '../entities/Opportunity';

export interface IOpportunityRepository {
  create(opportunity: Opportunity): Promise<Opportunity>;
  findById(id: string): Promise<Opportunity | null>;
  findByContactId(contactId: string): Promise<Opportunity[]>;
  update(id: string, data: Partial<Opportunity>): Promise<Opportunity>;
  updateStatus(id: string, status: string): Promise<Opportunity>;
}
