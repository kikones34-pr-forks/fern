/**
 * This file was auto-generated by Fern from our API Definition.
 */

export type RunningSubmissionState =
    | "QUEUEING_SUBMISSION"
    | "KILLING_HISTORICAL_SUBMISSIONS"
    | "WRITING_SUBMISSION_TO_FILE"
    | "COMPILING_SUBMISSION"
    | "RUNNING_SUBMISSION";

export const RunningSubmissionState = {
    QueueingSubmission: "QUEUEING_SUBMISSION",
    KillingHistoricalSubmissions: "KILLING_HISTORICAL_SUBMISSIONS",
    WritingSubmissionToFile: "WRITING_SUBMISSION_TO_FILE",
    CompilingSubmission: "COMPILING_SUBMISSION",
    RunningSubmission: "RUNNING_SUBMISSION",
    _visit: <R>(value: RunningSubmissionState, visitor: RunningSubmissionState.Visitor<R>) => {
        switch (value) {
            case RunningSubmissionState.QueueingSubmission:
                return visitor.queueingSubmission();
            case RunningSubmissionState.KillingHistoricalSubmissions:
                return visitor.killingHistoricalSubmissions();
            case RunningSubmissionState.WritingSubmissionToFile:
                return visitor.writingSubmissionToFile();
            case RunningSubmissionState.CompilingSubmission:
                return visitor.compilingSubmission();
            case RunningSubmissionState.RunningSubmission:
                return visitor.runningSubmission();
            default:
                return visitor._other();
        }
    },
} as const;

export declare namespace RunningSubmissionState {
    interface Visitor<R> {
        queueingSubmission: () => R;
        killingHistoricalSubmissions: () => R;
        writingSubmissionToFile: () => R;
        compilingSubmission: () => R;
        runningSubmission: () => R;
        _other: () => R;
    }
}