// src/services/ContactService.ts
import { Contacts, Contact } from '@capawesome-team/capacitor-contacts';
import { Clipboard } from '@capacitor/clipboard';

class ContactService {
  private readonly STORAGE_KEY = 'contacts';

  // LocalStorage mit Plugin-Contact Type
  async getContacts(): Promise<Contact[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async saveContact(contact: Contact): Promise<void> {
    const contacts = await this.getContacts();
    const existingIndex = contacts.findIndex(c => c.id === contact.id);
    
    if (existingIndex >= 0) {
      contacts[existingIndex] = contact;
    } else {
      // Einfach hinzufügen - ohne createdAt/updatedAt da Plugin das nicht hat
      contacts.push({
        ...contact,
        id: contact.id || Date.now().toString()
      });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
  }

  async deleteContact(id: string): Promise<void> {
    const contacts = await this.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  // Capacitor Contacts Plugin - vereinfacht
  async importFromDevice(): Promise<Contact[]> {
    try {
      const permission = await Contacts.requestPermissions();
      // Korrigiert: readContacts statt contacts
      if (permission.readContacts === 'granted') {
        // Vereinfacht: ohne projection (falls nicht unterstützt)
        const result = await Contacts.getContacts();
        return result.contacts; // Direkt zurückgeben - kein Mapping nötig!
      }
      return [];
    } catch (error) {
      console.error('Error importing contacts:', error);
      return [];
    }
  }

  // Clipboard Plugin - angepasst an Plugin-Felder
  async copyContactToClipboard(contact: Contact): Promise<void> {
    const name = `${contact.givenName || ''} ${contact.familyName || ''}`.trim();
    const phone = contact.phoneNumbers?.[0]?.value || '';
    const email = contact.emailAddresses?.[0]?.value || '';
    
    const contactText = `${name}\n${phone}\n${email}`;
    await Clipboard.write({
      string: contactText
    });
  }
}

export const contactService = new ContactService();