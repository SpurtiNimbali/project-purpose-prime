import type { ReactElement } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTummyStore, type ScreenKey } from "@/components/tummy/store";
import { TabBar } from "@/components/tummy/ui";
import { AssistantButton, AssistantSheet } from "@/components/tummy/assistant";
import {
  WelcomeScreen,
  SubjectIdScreen,
  VideoScreen,
  QuizScreen,
  ProtocolIntroScreen,
  TechnicalSetupScreen,
  PermissionsScreen,
  PracticeRunScreen,
  SchedulingScreen,
  MealPickScreen,
  SnackingScreen,
  AboutYouScreen,
  OnboardDoneScreen,
} from "@/components/tummy/onboarding";
import {
  SessionHubScreen,
  CaseReminderScreen,
  FastingCheckScreen,
  WhichMealScreen,
  MealCaptureScreen,
  MealEndScreen,
  SessionCheckScreen,
  PositioningScreen,
  RecordingScreen,
  PostMetaScreen,
  SnackSkipScreen,
  SkipReasonScreen,
  MissedWindowSheet,
  ExtraSessionScreen,
  UploadDoneScreen,
} from "@/components/tummy/recording";
import {
  MorningQuestionsScreen,
  EveningCheckinScreen,
} from "@/components/tummy/questions";
import {
  HomeScreen,
  LogHubScreen,
  LogMealScreen,
  LogSymptomScreen,
  LogSleepScreen,
  LogActivityScreen,
  LogHydrationScreen,
  LogToiletScreen,
  ProgressScreen,
  ProfileScreen,
  PeriodCheckScreen,
  ContactScreen,
  ContactFormScreen,
  ContactComplaintScreen,
} from "@/components/tummy/main";

const TITLE = "Tummy: Stanford bowel sound study companion";
const DESC =
  "Tummy guides participants in the Stanford School of Medicine bowel sound study through daily recordings, meal, sleep and symptom logging.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TummyApp,
});

const TAB_SCREENS: ScreenKey[] = ["home", "logHub", "progress", "profile"];
const DARK_SCREENS: ScreenKey[] = ["positioning", "recording", "practiceRun"];
const ONBOARD_SCREENS: ScreenKey[] = [
  "welcome",
  "subjectId",
  "protocolIntro",
  "video",
  "quiz",
  "technicalSetup",
  "permissions",
  "practiceRun",
  "scheduling",
  "mealPick",
  "snacking",
  "aboutYou",
  "onboardDone",
];

function TummyApp() {
  const store = useTummyStore();
  const s = store.screen;

  const screens: Record<ScreenKey, ReactElement> = {
    welcome: <WelcomeScreen store={store} />,
    subjectId: <SubjectIdScreen store={store} />,
    video: <VideoScreen store={store} />,
    quiz: <QuizScreen store={store} />,
    protocolIntro: <ProtocolIntroScreen store={store} />,
    technicalSetup: <TechnicalSetupScreen store={store} />,
    permissions: <PermissionsScreen store={store} />,
    practiceRun: <PracticeRunScreen store={store} />,
    scheduling: <SchedulingScreen store={store} />,
    mealPick: <MealPickScreen store={store} />,
    snacking: <SnackingScreen store={store} />,
    aboutYou: <AboutYouScreen store={store} />,
    onboardDone: <OnboardDoneScreen store={store} />,
    home: <HomeScreen store={store} />,
    sessionHub: <SessionHubScreen store={store} />,
    caseReminder: <CaseReminderScreen store={store} />,
    fastingCheck: <FastingCheckScreen store={store} />,
    whichMeal: <WhichMealScreen store={store} />,
    mealCapture: <MealCaptureScreen store={store} />,
    mealEnd: <MealEndScreen store={store} />,
    sessionCheck: <SessionCheckScreen store={store} />,
    positioning: <PositioningScreen store={store} />,
    recording: <RecordingScreen store={store} />,
    postMeta: <PostMetaScreen store={store} />,
    snackSkip: <SnackSkipScreen store={store} />,
    skipReason: <SkipReasonScreen store={store} />,
    extraSession: <ExtraSessionScreen store={store} />,
    morningQuestions: <MorningQuestionsScreen store={store} />,
    eveningCheckin: <EveningCheckinScreen store={store} />,
    uploadDone: <UploadDoneScreen store={store} />,
    logHub: <LogHubScreen store={store} />,
    logMeal: <LogMealScreen store={store} />,
    logSymptom: <LogSymptomScreen store={store} />,
    logSleep: <LogSleepScreen store={store} />,
    logActivity: <LogActivityScreen store={store} />,
    logHydration: <LogHydrationScreen store={store} />,
    logToilet: <LogToiletScreen store={store} />,
    progress: <ProgressScreen store={store} />,
    profile: <ProfileScreen store={store} />,
    periodCheck: <PeriodCheckScreen store={store} />,
    contact: <ContactScreen store={store} />,
    contactForm: <ContactFormScreen store={store} />,
    contactComplaint: <ContactComplaintScreen store={store} />,
  };

  const dark = DARK_SCREENS.includes(s);
  const showAssistant = !ONBOARD_SCREENS.includes(s) && s !== "recording";
  const showAssistantButton = showAssistant && (TAB_SCREENS.includes(s) || s === "sessionHub");

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-wash p-0 sm:bg-mint-soft sm:p-8">
      <div
        className="relative flex h-screen w-full flex-col overflow-hidden bg-wash sm:h-[860px] sm:w-[400px] sm:rounded-[46px] sm:border-[10px] sm:border-pine sm:shadow-2xl"
        style={{ backgroundColor: dark ? "#143029" : "#E7F1EC" }}
      >
        <div className="flex min-h-0 flex-1 flex-col">{screens[s]}</div>
        {showAssistantButton ? <AssistantButton store={store} dark={dark} /> : null}
        {TAB_SCREENS.includes(s) ? <TabBar store={store} /> : null}
        {showAssistant ? <AssistantSheet store={store} /> : null}
        {!ONBOARD_SCREENS.includes(s) ? <MissedWindowSheet store={store} /> : null}
      </div>
    </main>
  );
}
