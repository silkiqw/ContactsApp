<!-- src/views/ContactList.vue -->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Kontakte</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="addContact">
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Suchleiste -->
      <ion-searchbar
        v-model="searchQuery"
        placeholder="Kontakte durchsuchen..."
        @ionInput="onSearchInput"
        show-clear-button="focus"
      ></ion-searchbar>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Kontakte werden geladen...</p>
      </div>

      <!-- Kontakte Liste -->
      <ion-list v-else-if="contacts.length > 0">
        <ion-item
          v-for="contact in contacts"
          :key="contact.id"
          button
          @click="contact.id && openContact(contact.id)"
        >
          <ion-avatar slot="start">
            <div class="avatar-placeholder">
              {{ getInitials(contact) }}
            </div>
          </ion-avatar>
          
          <ion-label>
            <h2>{{ getDisplayName(contact) }}</h2>
            <p v-if="contact.phoneNumbers && contact.phoneNumbers.length > 0">
              {{ contact.phoneNumbers[0].value }}
            </p>
            <p v-if="contact.emailAddresses && contact.emailAddresses.length > 0">
              {{ contact.emailAddresses[0].value }}
            </p>
          </ion-label>

          <ion-buttons slot="end">
            <ion-button 
              v-if="contact.phoneNumbers && contact.phoneNumbers.length > 0"
              fill="clear" 
              @click.stop="callContact(contact.phoneNumbers[0].value || '')"
            >
              <ion-icon :icon="callOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>

      <!-- Keine Kontakte -->
      <div v-else class="empty-state">
        <ion-icon :icon="peopleOutline" size="large"></ion-icon>
        <h2>Keine Kontakte gefunden</h2>
        <p>Fügen Sie Ihren ersten Kontakt hinzu oder überprüfen Sie Ihre Suchkriterien.</p>
        <ion-button @click="addContact" expand="block">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          Kontakt hinzufügen
        </ion-button>
      </div>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="addContact">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonAvatar,
  IonIcon, IonSpinner, IonFab, IonFabButton, alertController
} from '@ionic/vue';
import { addOutline, callOutline, peopleOutline } from 'ionicons/icons';
import { useContacts } from '../composables/useContacts';
import type { Contact } from '@capawesome-team/capacitor-contacts';

const router = useRouter();
const { contacts, isLoading, searchQuery, loadContacts, setSearchQuery } = useContacts();

const onSearchInput = (event: any) => {
  setSearchQuery(event.target.value);
};

const getDisplayName = (contact: Contact): string => {
  const givenName = contact.givenName || '';
  const familyName = contact.familyName || '';
  return `${givenName} ${familyName}`.trim() || 'Unbenannter Kontakt';
};

const getInitials = (contact: Contact): string => {
  const givenName = contact.givenName || '';
  const familyName = contact.familyName || '';
  const first = givenName.charAt(0).toUpperCase();
  const last = familyName.charAt(0).toUpperCase();
  return first + last || '?';
};

const openContact = (id: string) => {
  router.push(`/contact/${id}`);
};

const addContact = () => {
  router.push('/contact-form');
};

const callContact = async (phoneNumber: string) => {
  try {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_system');
    }
  } catch (error) {
    const alert = await alertController.create({
      header: 'Fehler',
      message: 'Anruf konnte nicht gestartet werden.',
      buttons: ['OK']
    });
    await alert.present();
  }
};

onMounted(async () => {
  try {
    await loadContacts();
  } catch (error) {
    const alert = await alertController.create({
      header: 'Fehler',
      message: 'Kontakte konnten nicht geladen werden. Bitte überprüfen Sie die Berechtigung.',
      buttons: ['OK']
    });
    await alert.present();
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  height: 60vh;
}

.empty-state ion-icon {
  color: var(--ion-color-medium);
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: var(--ion-color-dark);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--ion-color-medium);
  margin-bottom: 2rem;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-primary);
  color: white;
  font-weight: bold;
  border-radius: 50%;
}
</style>