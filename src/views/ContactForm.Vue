<!-- src/views/ContactForm.vue -->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="backUrl"></ion-back-button>
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
                v-model="formData.firstName"
                placeholder="Vorname eingeben"
                required
              ></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-label position="stacked">Nachname *</ion-label>
              <ion-input
                v-model="formData.lastName"
                placeholder="Nachname eingeben"
                required
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
                  v-model="phone.number"
                  placeholder="Telefonnummer"
                  type="tel"
                ></ion-input>
              </ion-item>
              
              <ion-item>
                <ion-label position="stacked">Typ</ion-label>
                <ion-select v-model="phone.type" placeholder="Typ auswählen">
                  <ion-select-option value="mobile">Mobil</ion-select-option>
                  <ion-select-option value="home">Privat</ion-select-option>
                  <ion-select-option value="work">Geschäftlich</ion-select-option>
                  <ion-select-option