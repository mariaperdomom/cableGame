import { addDoc, collection, doc, Firestore, getDocs, query, updateDoc, where, CollectionReference, DocumentData } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAohyXq3R4t3ao7KFzLDY7W6--g6kOuS7Q',
	authDomain: 'eviusauthdev.firebaseapp.com',
	databaseURL: 'https://eviusauthdev-default-rtdb.firebaseio.com',
	projectId: 'eviusauthdev',
	storageBucket: 'eviusauthdev.appspot.com',
	messagingSenderId: '86708016609',
	appId: '1:86708016609:web:129d087ffa3077a1ef2ea0',
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseDB = getFirestore(FirebaseApp);

//*----------------------------------- Entidad del servicio -----------------------------------------

export class CheckInServiceTs {
	eventId: string = '66e4928e446844dcb6079aa2'; //Todo: Aquí coloca el id del evento
	experienceId: string = 'i0own9qlUQ'; //toDo: Aquí coloca el id de la experiencia asignada
	participationCollection: CollectionReference<DocumentData, DocumentData>;
	attendeesCollection: CollectionReference<DocumentData, DocumentData>;
	experiences: Experience[] = [
		{
			id: 'i0own9qlUQ',
			name: 'EXPERIENCIA HUBBELL - HOLOGRAMA INTERACTIVO',
		},
		{
			id: 'KbCLd9hZ3r',
			name: 'EXPERIENCIA WIRING - JUEGO DE DESTREZA EN TÓTEM',
		},
		{
			id: 'cyhH5yUGs5',
			name: 'CHANCE LINEMAN TOOLS - MEMORY MATCH',
		},
		{
			id: 'HI0qLLtutT',
			name: 'EXPERIENCIA KILLARK - TRIVIA EN TÓTEM',
		},
		{
			id: 'Fjkyw8lfUy',
			name: 'EXPERIENCIA BURNDY - REALIDAD VIRTUAL CON OCULUS',
		},
		{
			id: 'jZ8JxL0Vue',
			name: 'EXPERIENCIA WIRING - DETECCIÓN DE FALLAS VR',
		},
		{
			id: '45VD1hir8z',
			name: 'EXPERIENCIA RACO - JUEGO DE DESTREZA EN TÓTEM',
		},
	];

	constructor(private readonly firebaseDB: Firestore) {
		this.participationCollection = collection(this.firebaseDB, `event/${this.eventId}/usersActivityIntoExperiences`);
		this.attendeesCollection = collection(this.firebaseDB, `/${this.eventId}_event_attendees`);
	}

	async getUserParticipation({ userCode }: { userCode: string }) {
		const q = query(this.participationCollection, where('userCode', '==', userCode), where('experienceId', '==', this.experienceId));

		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const participation: Participation = {
				id: querySnapshot.docs[0].id,
				...(querySnapshot.docs[0].data() as Omit<Participation, 'id'>),
			};
			return participation as Participation;
		} else {
			return null;
		}
	}

	async getUsersParticipation() {
		const querySnapshot = await getDocs(this.participationCollection); // Obtener todos los documentos

		if (!querySnapshot.empty) {
			// Mapeamos todos los documentos a un array de objetos Participation
			const usersParticipation: Participation[] = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...(doc.data() as Omit<Participation, 'id'>),
			}));

			return usersParticipation;
		} else {
			return [];
		}
	}

	async saveUserParticipation({ userCode, checkInAt = new Date().toUTCString(), points = 0 }: SaveParticipationOfUser) {
		const attendee = await this.getAttendeeByUserCode({ userCode });

		if (attendee === null) throw Error('404');

		const previousParticipation = await this.getUserParticipation({ userCode });
		if (previousParticipation) {
			const docId = previousParticipation.id;
			const userExperienceRef = doc(this.firebaseDB, `event/${this.eventId}/usersActivityIntoExperiences`, docId);
			await updateDoc(userExperienceRef, { points });

			return docId;
		} else {
			const experience = this.getExperienceById({ experienceId: this.experienceId });
			const attendee = await this.getAttendeeByUserCode({ userCode });

			if (!attendee) return console.error('El código no esta registrado');

			const newDoc: Omit<Participation, 'id'> = {
				userCode,
				checkInAt,
				experienceId: this.experienceId,
				experienceName: experience.name,
				points,
				email: attendee.properties.email,
				names: attendee.properties.names,
			};
			const newDocRef = await addDoc(this.participationCollection, newDoc);
			return newDocRef.id;
		}
	}

	async getAttendeeByUserCode({ userCode }: { userCode: string }): Promise<Attendee | null> {
		const q = query(this.attendeesCollection, where('user_code', '==', userCode));

		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			if (querySnapshot.docs.length > 1) throw new Error('Código asignado a dos usuarios');

			const docId = querySnapshot.docs[0].id;
			const data = querySnapshot.docs[0].data() as Omit<Attendee, 'id'>;
			const attendee: Attendee = {
				id: docId,
				...data,
			};
			return attendee as Attendee;
		}
		return null;
	}

	async getAllAttendee() {
		const snapshot = await getDocs(this.attendeesCollection);
		const attendees: any[] = [];
		snapshot.forEach((doc) => {
			const attendee = {
				id: doc.id,
				...doc.data(),
			};
			attendees.push(attendee);
		});
		return attendees;
	}

	getAllExperience() {
		return this.experiences;
	}
	getExperienceById({ experienceId }: { experienceId: string }) {
		const experience = this.experiences.find((experience) => experience.id === experienceId) as Experience;
		return experience;
	}
}

export const checkInServiceTs = new CheckInServiceTs(FirebaseDB);

//*------------------------------------------ Types ----------------------------------------------
export interface Attendee {
	id: string;
	account_id: string;
	private_reference_number: string;
	printouts: number;
	state_id: string;
	properties: Properties;
	rol_id: string;
	checkedin_type: string;
	event_id: string;
	checked_in: boolean;
	_id: string;
	model_type: string;
}

export interface Properties {
	email: string;
	names: string;
}

export type SaveParticipationOfUser = Omit<Participation, 'id' | 'experienceId' | 'experienceName' | 'email' | 'names' | 'checkInAt'> & { checkInAt?: string };

export type Participation = {
	id: string;
	experienceId: string;
	experienceName: string;
	userCode: string;
	points?: number;
	checkInAt: string;
	email: string;
	names: string;
};

export interface Experience {
	id: string;
	name: string;
}
