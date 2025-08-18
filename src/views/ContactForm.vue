<!-- src/views/ContactForm.vue - Navigation Fix -->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="backUrl" @click="handleBackButton"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEditing ? 'Kontakt bearbeiten' : 'Neuer Kontakt' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="saveContact" :disabled="!isFormValid">
            Speichern
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.prevent="saveContact">
        <!-- Grunddaten -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Grunddaten</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Vorname *</ion-label>
              <ion-input
                v-model="formData.givenName"
                placeholder="Vorname eingeben"
                required
                :class="{ 'ion-invalid': !formData.givenName && showValidation }"
              ></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-label position="stacked">Nachname *</ion-label>
              <ion-input
                v-model="formData.familyName"
                placeholder="Nachname eingeben"
                required
                :class="{ 'ion-invalid': !formData.familyName && showValidation }"
              ></ion-input>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Telefonnummern -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              Telefonnummern
              <ion-button fill="clear" @click="addPhoneNumber">
                <ion-icon :icon="addOutline"></ion-icon>
              </ion-button>
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div
              v-for="(phone, index) in formData.phoneNumbers"
              :key="index"
              class="phone-entry"
            >
              <ion-item>
                <ion-label position="stacked">Telefonnummer</ion-label>
                <ion-input
                  v-model="phone.value"
                  placeholder="Telefonnummer"
                  type="tel"
                ></ion-input>
                <ion-button 
                  v-if="formData.phoneNumbers.length > 1"
                  fill="clear" 
                  slot="end" 
                  @click="removePhoneNumber(index)"
                >
                  <ion-icon :icon="removeOutline"></ion-icon>
                </ion-button>
              </ion-item>
              
              <ion-item>
                <ion-label position="stacked">Typ</ion-label>
                <ion-select v-model="phone.label" placeholder="Typ auswählen">
                  <ion-select-option value="mobile">Mobil</ion-select-option>
                  <ion-select-option value="home">Privat</ion-select-option>
                  <ion-select-option value="work">Geschäftlich</ion-select-option>
                  <ion-select-option value="other">Sonstiges</ion-select-option>
                </ion-select>
              </ion-item>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- E-Mail Adressen -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              E-Mail Adressen
              <ion-button fill="clear" @click="addEmailAddress">
                <ion-icon :icon="addOutline"></ion-icon>
              </ion-button>
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div
              v-for="(email, index) in formData.emailAddresses"
              :key="index"
              class="email-entry"
            >
              <ion-item>
                <ion-label position="stacked">E-Mail Adresse</ion-label>
                <ion-input
                  v-model="email.value"
                  placeholder="E-Mail Adresse"
                  type="email"
                ></ion-input>
                <ion-button 
                  v-if="formData.emailAddresses.length > 1"
                  fill="clear" 
                  slot="end" 
                  @click="removeEmailAddress(index)"
                >
                  <ion-icon :icon="removeOutline"></ion-icon>
                </ion-button>
              </ion-item>
              
              <ion-item>
                <ion-label position="stacked">Typ</ion-label>
                <ion-select v-model="email.label" placeholder="Typ auswählen">
                  <ion-select-option value="home">Privat</ion-select-option>
                  <ion-select-option value="work">Geschäftlich</ion-select-option>
                  <ion-select-option value="other">Sonstiges</ion-select-option>
                </ion-select>
              </ion-item>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Geburtstag -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Geburtstag</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Geburtstag</ion-label>
              <ion-datetime-button datetime="birthday-modal"></ion-datetime-button>
            </ion-item>

            <!-- DatePicker Modal -->
            <ion-modal :keep-contents-mounted="true">
              <ion-datetime 
                id="birthday-modal"
                v-model="birthdayString"
                presentation="date"
                :max="new Date().toISOString().split('T')[0]"
                @ionChange="onBirthdayChange"
              ></ion-datetime>
            </ion-modal>
          </ion-card-content>
        </ion-card>

        <!-- Notizen -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Notizen</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Notizen</ion-label>
              <ion-textarea
                v-model="formData.note"
                placeholder="Zusätzliche Informationen..."
                :rows="3"
              ></ion-textarea>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <ion-button 
            expand="block" 
            fill="outline" 
            @click="cancelForm"
            color="medium"
          >
            Abbrechen
          </ion-button>
          
          <ion-button 
            expand="block" 
            @click="saveContact" 
            :disabled="!isFormValid || isSaving"
            color="primary"
          >
            <ion-spinner v-if="isSaving" name="crescent"></ion-spinner>
            <span v-else>{{ isEditing ? 'Aktualisieren' : 'Speichern' }}</span>
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonDatetimeButton, IonModal, IonDatetime, IonIcon, IonSpinner,
  alertController, toastController
} from '@ionic/vue';
import { addOutline, removeOutline } from 'ionicons/icons';
import { useContacts } from '../composables/useContacts';
import type { Contact, PhoneNumber, EmailAddress, Birthday } from '@capawesome-team/capacitor-contacts';

interface Props {
  id?: string;
}

interface FormData {
  givenName: string;
  familyName: string;
  phoneNumbers: PhoneNumber[];
  emailAddresses: EmailAddress[];
  birthday?: Birthday;
  note?: string;
}

const props = defineProps<Props>();
const router = useRouter();
const route = useRoute();

const { getContact, createContact, updateContact, loadContacts } = useContacts();

const isSaving = ref(false);
const showValidation = ref(false);
const birthdayString = ref<string | undefined>();

const contactId = computed(() => props.id || route.params.id as string);
const isEditing = computed(() => !!contactId.value);

// KORRIGIERTE NAVIGATION LOGIC:
const backUrl = computed(() => {
  if (isEditing.value) {
    // Beim Bearbeiten: zurück zu ContactDetails
    return `/contact/${contactId.value}`;
  } else {
    // Bei neuem Kontakt: zurück zur Kontaktliste
    return '/contacts';
  }
});

// Funktion zum Zurücksetzen der Formulardaten
const getDefaultFormData = (): FormData => ({
  givenName: '',
  familyName: '',
  phoneNumbers: [{ value: '', label: 'mobile' }],
  emailAddresses: [{ value: '', label: 'home' }],
  birthday: undefined,
  note: ''
});

const formData = reactive<FormData>(getDefaultFormData());

const isFormValid = computed(() => {
  const hasRequiredFields = formData.givenName.trim() && formData.familyName.trim();
  const hasValidPhone = formData.phoneNumbers.some(phone => phone.value?.trim());
  return hasRequiredFields && hasValidPhone;
});

// NEUE FUNKTION: Back-Button Handler
const handleBackButton = (event: Event) => {
  event.preventDefault(); // Verhindert die Standard-Navigation
  
  if (isEditing.value) {
    // Beim Bearbeiten: zurück zu ContactDetails
    router.push(`/contact/${contactId.value}`);
  } else {
    // Bei neuem Kontakt: zurück zur Kontaktliste
    router.push('/contacts');
  }
};

// Formular zurücksetzen
const resetForm = () => {
  const defaultData = getDefaultFormData();
  Object.assign(formData, defaultData);
  birthdayString.value = undefined;
  showValidation.value = false;
};

const loadContactData = async () => {
  if (isEditing.value) {
    await loadContacts();
    const contact = getContact(contactId.value);
    
    if (contact) {
      formData.givenName = contact.givenName || '';
      formData.familyName = contact.familyName || '';
      formData.note = contact.note || '';
      formData.birthday = contact.birthday;
      
      // Geburtstag für datetime-Anzeige konvertieren
      if (contact.birthday) {
        const { day, month, year } = contact.birthday;
        if (day && month && year) {
          const date = new Date(year, month - 1, day);
          birthdayString.value = date.toISOString();
        }
      }
      
      // Telefonnummern laden
      if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        formData.phoneNumbers = contact.phoneNumbers.map(phone => ({
          value: phone.value || '',
          label: phone.label || 'mobile'
        }));
      }
      
      // E-Mail Adressen laden
      if (contact.emailAddresses && contact.emailAddresses.length > 0) {
        formData.emailAddresses = contact.emailAddresses.map(email => ({
          value: email.value || '',
          label: email.label || 'home'
        }));
      }
    }
  } else {
    // Für neue Kontakte: Formular zurücksetzen
    resetForm();
  }
};

// Watch für Route-Änderungen (wichtig für das Reset-Problem)
watch(() => route.params.id, async () => {
  await loadContactData();
});

const addPhoneNumber = () => {
  formData.phoneNumbers.push({ value: '', label: 'mobile' });
};

const removePhoneNumber = (index: number) => {
  if (formData.phoneNumbers.length > 1) {
    formData.phoneNumbers.splice(index, 1);
  }
};

const addEmailAddress = () => {
  formData.emailAddresses.push({ value: '', label: 'home' });
};

const removeEmailAddress = (index: number) => {
  if (formData.emailAddresses.length > 1) {
    formData.emailAddresses.splice(index, 1);
  }
};

const onBirthdayChange = (event: any) => {
  birthdayString.value = event.detail.value;
  if (birthdayString.value) {
    const date = new Date(birthdayString.value);
    formData.birthday = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  } else {
    formData.birthday = undefined;
  }
};

const saveContact = async () => {
  showValidation.value = true;
  
  if (!isFormValid.value) {
    const toast = await toastController.create({
      message: 'Bitte füllen Sie alle Pflichtfelder aus.',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
    return;
  }

  try {
    isSaving.value = true;

    // Daten für das Contacts Plugin formatieren
    const contactData: Partial<Contact> = {
      givenName: formData.givenName.trim(),
      familyName: formData.familyName.trim(),
      phoneNumbers: formData.phoneNumbers
        .filter(phone => phone.value?.trim())
        .map(phone => ({
          label: phone.label || 'mobile',
          value: phone.value?.trim() || ''
        })),
      emailAddresses: formData.emailAddresses
        .filter(email => email.value?.trim())
        .map(email => ({
          label: email.label || 'home',
          value: email.value?.trim() || ''
        })),
      birthday: formData.birthday,
      note: formData.note?.trim() || undefined
    };

    if (isEditing.value) {
      await updateContact(contactId.value, contactData);
      
      const toast = await toastController.create({
        message: 'Kontakt wurde aktualisiert.',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      
      // KORRIGIERT: Nach dem Speichern zurück zu ContactDetails
      router.push(`/contact/${contactId.value}`);
    } else {
      await createContact(contactData);
      
      const toast = await toastController.create({
        message: 'Kontakt wurde erstellt.',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      
      // Nach dem Erstellen zurück zur Kontaktliste
      router.push('/contacts');
    }

  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    
    const alert = await alertController.create({
      header: 'Fehler',
      message: 'Kontakt konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
      buttons: ['OK']
    });
    await alert.present();
  } finally {
    isSaving.value = false;
  }
};

const cancelForm = async () => {
  const hasChanges = formData.givenName || formData.familyName || 
                    formData.phoneNumbers.some(p => p.value) ||
                    formData.emailAddresses.some(e => e.value) ||
                    formData.note;

  if (hasChanges) {
    const alert = await alertController.create({
      header: 'Änderungen verwerfen?',
      message: 'Möchten Sie das Formular wirklich verlassen? Alle Änderungen gehen verloren.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Verlassen',
          role: 'destructive',
          handler: () => {
            // KORRIGIERTE CANCEL NAVIGATION:
            if (isEditing.value) {
              router.push(`/contact/${contactId.value}`);
            } else {
              router.push('/contacts');
            }
          }
        }
      ]
    });
    await alert.present();
  } else {
    // KORRIGIERTE CANCEL NAVIGATION:
    if (isEditing.value) {
      router.push(`/contact/${contactId.value}`);
    } else {
      router.push('/contacts');
    }
  }
};

onMounted(() => {
  loadContactData();
});
</script>

<style scoped>
.phone-entry,
.email-entry {
  border-bottom: 1px solid var(--ion-color-light);
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}

.phone-entry:last-child,
.email-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.action-buttons {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-buttons ion-button {
  margin: 0;
}

.ion-invalid {
  --border-color: var(--ion-color-danger);
}

ion-card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

ion-card-title ion-button {
  margin: 0;
  --padding-start: 8px;
  --padding-end: 8px;
}
</style>