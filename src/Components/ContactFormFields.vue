<!-- src/components/ContactForm.vue -->
<template>
  <div>
    <ion-item>
      <ion-label position="stacked">Vorname *</ion-label>
      <ion-input 
        v-model="contact.firstName" 
        placeholder="Max"
        required
      ></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Nachname *</ion-label>
      <ion-input 
        v-model="contact.lastName" 
        placeholder="Mustermann"
        required
      ></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Telefon *</ion-label>
      <ion-input 
        v-model="contact.phone" 
        placeholder="+49 123 456789"
        type="tel"
        required
      ></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">E-Mail</ion-label>
      <ion-input 
        v-model="contact.email" 
        placeholder="max@example.com"
        type="email"
      ></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Geburtstag</ion-label>
      <ion-datetime-button datetime="birthday-modal"></ion-datetime-button>
    </ion-item>

    <!-- DatePicker Modal -->
    <ion-modal :keep-contents-mounted="true">
      <ion-datetime 
        id="birthday-modal"
        v-model="contact.birthDate"
        presentation="date"
        :max="new Date().toISOString().split('T')[0]"
      ></ion-datetime>
    </ion-modal>

    <ion-button 
      expand="block" 
      @click="handleSave" 
      :disabled="!isFormValid"
      color="primary"
      style="margin-top: 20px;"
    >
      {{ contact.id ? 'Aktualisieren' : 'Speichern' }}
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonButton
} from '@ionic/vue';
import type { Contact } from '@/types/Contact';

interface Props {
  initialContact?: Partial<Contact>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  save: [contact: Contact];
}>();

const contact = ref<Partial<Contact>>({
  firstName: props.initialContact?.firstName || '',
  lastName: props.initialContact?.lastName || '',
  phone: props.initialContact?.phone || '',
  email: props.initialContact?.email || '',
  birthDate: props.initialContact?.birthDate || undefined,
  id: props.initialContact?.id || undefined
});

const isFormValid = computed(() => 
  contact.value.firstName?.trim() && 
  contact.value.lastName?.trim() && 
  contact.value.phone?.trim()
);

const handleSave = () => {
  if (isFormValid.value) {
    emit('save', {
      ...contact.value,
      firstName: contact.value.firstName!.trim(),
      lastName: contact.value.lastName!.trim(),
      phone: contact.value.phone!.trim(),
      email: contact.value.email?.trim() || '',
    } as Contact);
  }
};
</script>