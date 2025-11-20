import { Subject, Faculty } from "../model/index.js";
import { Op } from "sequelize";

const DAYS_PER_WEEK = 6;
const SLOTS_PER_DAY = 5;

function createEmptyTimetable() {
    return Array.from({ length: DAYS_PER_WEEK }, () =>
        Array.from({ length: SLOTS_PER_DAY }, () => null)
    );
}

// Shuffle to prevent same daily pattern
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function pickSubject(subjects, day, slot, facultyBusy, dayNames, dailyCount, semKey) {
    shuffle(subjects); // Additional shuffle during pick to increase randomness

    for (const sub of subjects) {
        if (sub.remainingLectures <= 0) continue;

        const isFree = !facultyBusy[sub.faculty_id][dayNames[day]][slot + 1];
        if (!isFree) continue;

        // Check daily max 2 lecture rule
        const taughtToday = dailyCount[semKey][day][sub.subject_id] || 0;
        if (taughtToday >= 2) continue;

        return sub;
    }

    return null;
}

export const generateTimeTable = async (course_id, semester) => {
    try {
        if (!course_id || !semester) throw new Error("Missing parameters");

        let FySem, SySem, TySem;
        if (semester === "Even") {
            FySem = 2; SySem = 4; TySem = 6;
        } else {
            FySem = 1; SySem = 3; TySem = 5;
        }

        const subjects = await Subject.findAll({
            where: {
                semester: { [Op.or]: [FySem, SySem, TySem] },
                course_id
            },
            attributes: [
                "subject_id",
                "subject_name",
                "lecture_per_week",
                "faculty_id",
                "semester"
            ]
        });

        const FySubjects = subjects.filter(s => s.semester === FySem)
            .map(s => ({ ...s.dataValues, remainingLectures: s.lecture_per_week }));

        const SySubjects = subjects.filter(s => s.semester === SySem)
            .map(s => ({ ...s.dataValues, remainingLectures: s.lecture_per_week }));

        const TySubjects = subjects.filter(s => s.semester === TySem)
            .map(s => ({ ...s.dataValues, remainingLectures: s.lecture_per_week }));

        const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const slotNumbers = [1, 2, 3, 4, 5];

        const facultyBusy = {};
        const allFaculty = await Faculty.findAll();

        for (const fc of allFaculty) {
            facultyBusy[fc.faculty_id] = {};
            for (const day of dayNames) {
                facultyBusy[fc.faculty_id][day] = {};
                for (const slot of slotNumbers) {
                    facultyBusy[fc.faculty_id][day][slot] = false;
                }
            }
        }

        const timetables = {
            FY: createEmptyTimetable(),
            SY: createEmptyTimetable(),
            TY: createEmptyTimetable()
        };

        // Track daily subject repetition (max 2 rule)
        const dailyCount = {
            FY: Array.from({ length: DAYS_PER_WEEK }, () => ({})),
            SY: Array.from({ length: DAYS_PER_WEEK }, () => ({})),
            TY: Array.from({ length: DAYS_PER_WEEK }, () => ({})),
        };

        for (let day = 0; day < DAYS_PER_WEEK; day++) {

            //  SHUFFLE SUBJECT ORDER EACH DAY
            shuffle(FySubjects);
            shuffle(SySubjects);
            shuffle(TySubjects);

            for (let slot = 0; slot < SLOTS_PER_DAY; slot++) {
                const dname = dayNames[day];

                // FY
                const fySub = pickSubject(FySubjects, day, slot, facultyBusy, dayNames, dailyCount, "FY");
                if (fySub) {
                    timetables.FY[day][slot] = {
                        subject_id: fySub.subject_id,
                        subject_name: fySub.subject_name,
                        faculty_id: fySub.faculty_id,
                        semester: FySem
                    };

                    facultyBusy[fySub.faculty_id][dname][slot + 1] = true;
                    fySub.remainingLectures--;

                    dailyCount.FY[day][fySub.subject_id] =
                        (dailyCount.FY[day][fySub.subject_id] || 0) + 1;
                }

                // SY
                const sySub = pickSubject(SySubjects, day, slot, facultyBusy, dayNames, dailyCount, "SY");
                if (sySub) {
                    timetables.SY[day][slot] = {
                        subject_id: sySub.subject_id,
                        subject_name: sySub.subject_name,
                        faculty_id: sySub.faculty_id,
                        semester: SySem
                    };

                    facultyBusy[sySub.faculty_id][dname][slot + 1] = true;
                    sySub.remainingLectures--;

                    dailyCount.SY[day][sySub.subject_id] =
                        (dailyCount.SY[day][sySub.subject_id] || 0) + 1;
                }

                // TY
                const tySub = pickSubject(TySubjects, day, slot, facultyBusy, dayNames, dailyCount, "TY");
                if (tySub) {
                    timetables.TY[day][slot] = {
                        subject_id: tySub.subject_id,
                        subject_name: tySub.subject_name,
                        faculty_id: tySub.faculty_id,
                        semester: TySem
                    };

                    facultyBusy[tySub.faculty_id][dname][slot + 1] = true;
                    tySub.remainingLectures--;

                    dailyCount.TY[day][tySub.subject_id] =
                        (dailyCount.TY[day][tySub.subject_id] || 0) + 1;
                }
            }
        }

        return timetables;

    } catch (err) {
        console.error("Timetable Error:", err);
        throw err;
    }
};
