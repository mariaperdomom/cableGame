import { addDoc, collection, doc, Firestore, getDocs, query, updateDoc, where, CollectionReference, DocumentData, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyDDnc9WHXf4CWwXCVggeiarYGu_xBgibJY",
	authDomain: "eviusauth.firebaseapp.com",
	databaseURL: "https://eviusauth.firebaseio.com",
	projectId: "eviusauth",
	storageBucket: "eviusauth.appspot.com",
	messagingSenderId: "400499146867",
	appId: "1:400499146867:web:5d0021573a43a1df"
  };

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseDB = getFirestore(FirebaseApp);

//*----------------------------------- Entidad del servicio -----------------------------------------

export class CheckInServiceTs {
	eventId: string = '66d9babfff8148182c053214'; //Todo: Aquí coloca el id del evento
	experienceId: string = 'KbCLd9hZ3r'; //toDo: Aquí coloca el id de la experiencia asignada
	participationCollection: CollectionReference<DocumentData, DocumentData>;
	attendeesCollection: CollectionReference<DocumentData, DocumentData>;
	experiences = [
		{
			id: 'i0own9qlUQ',
			name: 'EXPERIENCIA HUBBELL - HOLOGRAMA INTERACTIVO', //Carlos Guerra
		},
		{
			id: 'KbCLd9hZ3r',
			name: 'EXPERIENCIA BURNDY - RACO - WIEGMANN - JUEGO DE DESTREZA EN TÓTEM', //Alejandra
		},
		{
			id: 'cyhH5yUGs5',
			name: 'CHANCE LINEMAN TOOLS - MEMORY MATCH', //Carlos Guerra
		},
		{
			id: 'HI0qLLtutT',
			name: 'EXPERIENCIA KILLARK - TRIVIA EN TÓTEM', //Fabian Salcedo
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
			name: 'EXPERIENCIA RACO - JUEGO DE DESTREZA EN TÓTEM', //Fabian Salcedo
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

	async saveUserParticipation({ userCode, points, newParticipation = false }: SaveParticipationOfUser) {
		const attendee = await this.getAttendeeByUserCode({ userCode });
		const now = new Date();

		const checkInAt = Timestamp.fromDate(now);
		const updateAt = Timestamp.fromDate(now);

		if (attendee === null) throw Error('404');

		const previousParticipation = await this.getUserParticipation({ userCode });

		if (previousParticipation) {
			const docId = previousParticipation.id;
			const userExperienceRef = doc(this.firebaseDB, `event/${this.eventId}/usersActivityIntoExperiences`, docId);

			const newPoints = points === undefined ? 0 : points;

			const newParticipationDateList: Timestamp[] = [...previousParticipation.participationDateList];
			if (newParticipation) {
				newParticipationDateList.push(checkInAt);
			}

			await updateDoc(userExperienceRef, { points: newPoints, updateAt, participationDateList: newParticipationDateList });

			return docId;
		} else {
			const experience = this.getExperienceById({ experienceId: this.experienceId });
			const attendee = await this.getAttendeeByUserCode({ userCode });

			if (!attendee) return console.error('El código no esta registrado');

			const newDoc: Omit<Participation, 'id'> = {
				participationDateList: [checkInAt],
				userCode,
				checkInAt,
				experienceId: this.experienceId,
				experienceName: experience.name,
				points: points === undefined ? 0 : points,
				email: attendee.properties.email,
				names: attendee.properties.names,
				updateAt,
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

export type SaveParticipationOfUser = Pick<Participation, 'userCode'> & { newParticipation?: boolean; points?: number };

export type Participation = {
	id: string;
	experienceId: string;
	experienceName: string;
	userCode: string;
	points: number;
	checkInAt: Timestamp;
	participationDateList: Timestamp[];
	email: string;
	names: string;
	updateAt: Timestamp;
};

export interface Experience {
	id: string;
	name: string;
}
