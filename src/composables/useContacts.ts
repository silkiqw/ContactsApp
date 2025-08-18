// src/Composables/useContacts.ts
import { ref, computed } from 'vue';
import { Contacts, type Contact, type CreateContactOptions } from '@capawesome-team/capacitor-contacts';

const contacts = ref<Contact[]>([]);
const isLoading = ref(false);
const searchQuery = ref('');

export function useContacts() {
  const filteredContacts = computed(() => {
    if (!searchQuery.value) return contacts.value;
    
    const query = searchQuery.value.toLowerCase();
    return contacts.value.filter((contact: Contact) =>
      // Suche in Namen (API verwendet givenName/familyName)
      `${contact.givenName || ''} ${contact.familyName || ''}`.toLowerCase().includes(query) ||
      // Suche in Telefonnummern (API verwendet value)
      contact.phoneNumbers?.some(phone => phone.value?.toLowerCase().includes(query)) ||
      // Suche in E-Mails (API verwendet value)
      contact.emailAddresses?.some(email => email.value?.toLowerCase().includes(query))
    );
  });

  const loadContacts = async () => {
    try {
      isLoading.value = true;
      
      // Berechtigung anfragen
      const permission = await Contacts.requestPermissions();
      if (permission.readContacts !== 'granted') {
        throw new Error('Berechtigung für Kontakte wurde verweigert');
      }

      // Kontakte laden - direkte Zuweisung ohne Mapping!
      const result = await Contacts.getContacts();
      contacts.value = result.contacts.sort((a, b) => {
        const nameA = a.givenName?.toLowerCase() || '';
        const nameB = b.givenName?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
      
      
    } catch (error) {
      console.error('Fehler beim Laden der Kontakte:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getContact = (id: string): Contact | undefined => {
    return contacts.value.find((contact: Contact) => contact.id === id);
  };

  const createContact = async (contactData: Partial<Contact>): Promise<void> => {
    try {
      const createOptions: CreateContactOptions = {
        contact: {
          givenName: contactData.givenName || '',
          familyName: contactData.familyName || '',
          phoneNumbers: contactData.phoneNumbers || [],
          emailAddresses: contactData.emailAddresses || [],
          birthday: contactData.birthday,
          note: contactData.note
        }
      };

      await Contacts.createContact(createOptions);
      
      // Kontakte neu laden
      await loadContacts();
      
    } catch (error) {
      console.error('Fehler beim Erstellen des Kontakts:', error);
      throw error;
    }
  };

  const updateContact = async (id: string, contactData: Partial<Contact>): Promise<void> => {
    try {
      // Hinweis: Das Plugin hat möglicherweise keine direkte Update-Funktion
      // Prüfe die Plugin-Dokumentation für die verfügbaren Methoden
      console.warn('Update-Funktionalität muss je nach Plugin-Version implementiert werden');
      
      await loadContacts();
      
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Kontakts:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string): Promise<void> => {
    try {
      await Contacts.deleteContactById({ id });
      await loadContacts();
      
    } catch (error) {
      console.error('Fehler beim Löschen des Kontakts:', error);
      throw error;
    }
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  return {
    contacts: filteredContacts,
    isLoading,
    searchQuery,
    loadContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    setSearchQuery
  };
}