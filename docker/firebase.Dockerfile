FROM node:20-bullseye-slim

WORKDIR /workspace

RUN npm install -g firebase-tools@13

COPY firebase.json .firebaserc firestore.rules ./

EXPOSE 8080 9099 4001 4400 4500

CMD ["sh", "-c", "firebase emulators:start --project ${FIREBASE_PROJECT_ID:-ta-cu-local} --only firestore,auth --import /firebase-data --export-on-exit /firebase-data"]
