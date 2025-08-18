<!-- src/views/ContactDetails.vue - Navigation Fix -->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/contacts" @click="goToContactList"></ion-back-button>
        </ion-buttons>
        <ion-title>Kontakt Details</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="editContact">
            <ion-icon :icon="createOutline"></ion-icon>
          </ion-button>
          <ion-button @click="showDeleteAlert">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="contact" class="contact-details">
        <!-- Header mit Avatar -->
        <div class="contact-header">
          <ion-avatar class="large-avatar">
            <div class="avatar-placeholder">
              {{ getInitials(contact) }}
            </div>
          </ion-avatar>
          <h1>{{ getDisplayName(contact) }}</h1>
        </div>

        <!-- Telefonnummern -->
        <ion-card v-if="contact.phoneNumbers && contact.phoneNumbers.length > 0">
          <ion-card-header>
            <ion-card-title>Telefonnummern</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item
                v-for="(phone, index) in contact.phoneNumbers"
                :key="index"
              >
                <ion-icon :icon="callOutline" slot="start"></ion-icon>
                <ion-label>
                  <h3>{{ phone.value }}</h3>
                  <p>{{ phone.label || 'Mobil' }}</p>
                </ion-label>
                <ion-buttons slot="end">
                  <ion-button fill="clear" @click="callNumber(phone.value || '')">
                    <ion-icon :icon="callOutline"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" @click="copyToClipboard(phone.value || '')">
                    <ion-icon :icon="copyOutline"></ion-icon>
                  </ion-button>
                </ion-buttons>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- E-Mail Adressen -->
        <ion-card v-if="contact.emailAddresses && contact.emailAddresses.length > 0">
          <ion-card-header>
            <ion-card-title>E-Mail Adressen</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item
                v-for="(email, index) in contact.emailAddresses"
                :key="index"
              >
                <ion-icon :icon="mailOutline" slot="start"></ion-icon>
                <ion-label>
                  <h3>{{ email.value }}</h3>
                  <p>{{ email.label || 'Privat' }}</p>
                </ion-label>
                <ion-buttons slot="end">
                  <ion-button fill="clear" @click="sendEmail(email.value || '')">
                    <ion-icon :icon="mailOutline"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" @click="copyToClipboard(email.value || '')">
                    <ion-icon :icon="copyOutline"></ion-icon>
                  </ion-button>
                </ion-buttons>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Geburtstag -->
        <ion-card v-if="contact.birthday">
          <ion-card-header>
            <ion-card-title>Geburtstag</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-icon :icon="giftOutline" slot="start"></ion-icon>
              <ion-label>
                <h3>{{ formatBirthday(contact.birthday) }}</h3>
              </ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Notizen -->
        <ion-card v-if="contact.note">
          <ion-card-header>
            <ion-card-title>Notizen</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ contact.note }}</p>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Kontakt nicht gefunden -->
      <div v-else class="not-found">
        <ion-icon :icon="personOutline" size="large"></ion-icon>
        <h2>Kontakt nicht gefunden</h2>
        <ion-button @click="goToContactList" fill="outline">
          Zurück zur Liste
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonBackButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonList, IonItem, IonLabel, IonAvatar, IonIcon,
  alertController, toastController
} from '@ionic/vue';
import {
  createOutline, trashOutline, callOutline, mailOutline, copyOutline,
  giftOutline, personOutline
} from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';
import { useContacts } from '../composables/useContacts';
import type { Contact } from '@capawesome-team/capacitor-contacts';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const router = useRouter();
const route = useRoute();

const { getContact, deleteContact, loadContacts } = useContacts();
const contact = ref<Contact | undefined>();

const contactId = computed(() => props.id || route.params.id as string);

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

const formatBirthday = (birthday: any): string => {
  if (birthday.day && birthday.month) {
    const day = birthday.day.toString().padStart(2, '0');
    const month = birthday.month.toString().padStart(2, '0');
    const year = birthday.year ? birthday.year : '';
    return year ? `${day}.${month}.${year}` : `${day}.${month}`;
  }
  return 'Unbekannt';
};

const callNumber = (phoneNumber: string) => {
  if (phoneNumber) {
    window.open(`tel:${phoneNumber}`, '_system');
  }
};

const sendEmail = (email: string) => {
  if (email) {
    window.open(`mailto:${email}`, '_system');
  }
};

const copyToClipboard = async (text: string) => {
  try {
    if (text) {
      await Clipboard.write({ string: text });
      const toast = await toastController.create({
        message: 'In Zwischenablage kopiert',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
  } catch (error) {
    console.error('Fehler beim Kopieren:', error);
  }
};

const editContact = () => {
  router.push(`/contact-form/${contactId.value}`);
};

// NEUE FUNKTION: Immer zur Kontaktliste zurück
const goToContactList = (event?: Event) => {
  if (event) {
    event.preventDefault();
  }
  router.push('/contacts');
};

const showDeleteAlert = async () => {
  const alert = await alertController.create({
    header: 'Kontakt löschen',
    message: 'Möchten Sie diesen Kontakt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
    buttons: [
      {
        text: 'Abbrechen',
        role: 'cancel'
      },
      {
        text: 'Löschen',
        role: 'destructive',
        handler: handleDelete
      }
    ]
  });
  await alert.present();
};

const handleDelete = async () => {
  try {
    if (contactId.value) {
      await deleteContact(contactId.value);
      const toast = await toastController.create({
        message: 'Kontakt wurde gelöscht',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
      // Nach dem Löschen zurück zur Hauptübersicht
      router.push('/contacts');
    }
  } catch (error) {
    const alert = await alertController.create({
      header: 'Fehler',
      message: 'Kontakt konnte nicht gelöscht werden.',
      buttons: ['OK']
    });
    await alert.present();
  }
};

onMounted(async () => {
  await loadContacts();
  contact.value = getContact(contactId.value);
});
</script>

<style scoped>
.contact-details {
  padding: 1rem;
}

.contact-header {
  text-align: center;
  padding: 2rem 1rem;
  background: var(--ion-color-light);
  margin: -1rem -1rem 1rem -1rem;
}

.large-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem auto;
}

.large-avatar .avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-primary);
  color: white;
  font-weight: bold;
  font-size: 2rem;
  border-radius: 50%;
}

.contact-header h1 {
  margin: 0;
  color: var(--ion-color-dark);
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  height: 60vh;
}

.not-found ion-icon {
  color: var(--ion-color-medium);
  margin-bottom: 1rem;
}

.not-found h2 {
  color: var(--ion-color-dark);
  margin-bottom: 2rem;
}
</style>