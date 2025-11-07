import { Contact } from '../entities/Contact';

export interface IContactRepository {
  create(contact: Contact): Promise<Contact>;
  findById(id: string): Promise<Contact | null>;
  findByWhatsApp(whatsapp: string): Promise<Contact | null>;
  update(id: string, data: Partial<Contact>): Promise<Contact>;
  list(filters?: any): Promise<Contact[]>;
}
