# Hearoo 🎧 — The Smart Audio Classifier & Visualizer

Welcome to **Hearoo**, your interactive, ResNet-powered audio classifier and visualizer! This project combines **state-of-the-art deep learning** with an intuitive web interface to make exploring sound exciting and insightful.

---

## 🚀 Overview

Hearoo is a **CNN-based audio classifier and visualizer** built on **ResNet**, trained using **Modal.com** on the **ESC-50 dataset**, which contains 50 diverse environmental sound categories like dog barks, rain, clapping, thunderstorm, and more.

- **Model Accuracy:** 81.25%  
- **Training Dataset:** ESC-50  
- **Loss:** 1.0082  
- **Validation Loss:** 1.3925  

Hearoo can:

1. **Classify your audio files** (WAV format) into 50 sound categories.  
2. **Visualize deep feature maps** from ResNet layers to see how the network understands sound.  
3. Explore the **waveform and spectrogram** of your audio in a beautiful, interactive UI.

---

## 🎯 Features

- **Upload or use sample audio files** from the ESC-50 dataset.  
- **Interactive ResNet feature maps** display how each convolutional layer reacts to sounds.  
- **Top-3 predictions** with confidence scores for easy interpretation.  
- **Waveform and spectrogram visualization** to understand audio patterns.   
- **Credits warning system** to remind users about Modal.com usage limits (customizable).  

---

## 🔊 Sample Audios

Try Hearoo instantly with these sample audio files:

- Can Opening  
- Chirping Birds  
- Clapping  
- Knocking  
- Thunderstorm  

You can also explore **more audio samples** from the [ESC-50 dataset](https://github.com/karoldvl/ESC-50).

---

## ⚡ How It Works

1. The **frontend** is built in **Next.js 15** for an interactive, reactive experience.  
2. The **backend** runs on **Modal.com**, where ResNet is trained and serves predictions via a secure endpoint.  
3. When a user uploads or selects a sample, the **frontend sends audio to Modal**, which returns:
   - Top-3 predictions  
   - Feature maps of ResNet layers  
   - Input spectrogram  
   - Audio waveform  

All results are displayed in real-time, making audio exploration seamless and visually appealing.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React, Tailwind CSS  
- **Backend / Model Hosting:** Modal.com  
- **Deep Learning:** PyTorch, Torchaudio  
- **Audio Dataset:** ESC-50 (50 environmental sound classes)  

---

## 🔐 Future Updates
- Future updates may include **authentication** so only authorized users can analyze audio.  
---

