import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from '../../components/axiosInstance'; // Replace with the correct path to your Axios instance

// Async thunk for creating a quiz
export const createQuiz = createAsyncThunk(
    "quiz/add",
    async ({ quiz, questions }, { rejectWithValue }) => {
        try {
            quiz.start = new Date(quiz.start).toISOString();  // Ensures UTC format
            quiz.end = new Date(quiz.end).toISOString();  // Ensures UTC format
            const response = await axiosInstance.post("quiz/add/", { quiz, questions }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            console.log(response.data);
            return response.data; // Assuming the response contains the created quiz or success message
        } catch (error) {
            return rejectWithValue(error.response.data); // Pass error messages to the state
        }
    }
);
// Async thunk for fetching all quizzes
export const fetchQuizzes = createAsyncThunk(
    "quizzes/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("quizzes/fetch/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            return response.data; // Assuming the response contains the quizzes
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    },
);
// Async thunk for fetching a quiz by id
export const fetchSingleQuiz = createAsyncThunk(
    "quiz/fetch",
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`quizzes/fetch/${quizId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            console.log(response.data)
            return response.data; // Assuming the response contains the quizzes
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    },
);
// Async thunk for save student answer
export const saveStudentAnswer = createAsyncThunk(
    "quiz/save",
    async ({ answers, timing, quizId }, { rejectWithValue }) => {
        try {
            console.log({ answers, timing })
            const response = await axiosInstance.post("quiz/answer/save/", { answers, timing, quizId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            console.log(response.data)
            return response.data; // Assuming the response contains the created quiz or success message
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

// Async thunk for fetch student result
export const fetchStudentResult = createAsyncThunk(
    "quiz/result",
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`quiz/result/${quizId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            console.log(response.data)
            return response.data; // Assuming the response contains the created quiz or success message
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },

);

// Async thunk for fetch all quiz results
export const fetchQuizResults = createAsyncThunk(
    "quiz/results",
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`quiz/results/${quizId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            console.log(response.data)
            return response.data; // Assuming the response contains the created quiz or success message
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },

);
// Async thunk for fetch student answers
export const fetchStudentAnswer = createAsyncThunk(
    "quiz/studentanswer",
    async (resultId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`quiz/${resultId}/result/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            console.log(response.data)
            return response.data; // Assuming the response contains the created quiz or success message
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },

);

// Quiz slice
const quizSlice = createSlice({
    name: "quiz",
    initialState: {
        quiz: {},
        quizzes: [],
        questions: [],
        loading: false,
        error: null,
        result: null,
        isTaken: false,
        results: null
    },
    reducers: {
        // Define synchronous reducers here if needed
    },
    extraReducers: (builder) => {
        // create new quiz
        builder
            .addCase(createQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.quiz = action.payload.quiz; // Adjust based on your API response
                state.questions = action.payload.questions || [];
            })
            .addCase(createQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
        // fetch quizzes
        builder
            .addCase(fetchQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quiz = {};
                state.quizzes = action.payload;
                state.questions = action.payload.questions || [];
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
        // fetch single quiz
        builder
            .addCase(fetchSingleQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleQuiz.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.result) {// if student has result  
                    state.result = action.payload.result
                    state.quiz = action.payload.quiz
                    state.isTaken = true
                } else { // display the quiz for first time
                    state.quiz = action.payload; // Assuming API returns a single quiz object
                    state.questions = action.payload.exam_questions || []; // Assuming the quiz includes its questions
                }

            })
            .addCase(fetchSingleQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });
        // save student answer
        builder
            .addCase(saveStudentAnswer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveStudentAnswer.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
                state.isTaken = true
            })
            .addCase(saveStudentAnswer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });


        // fetch student quiz result
        builder
            .addCase(fetchStudentResult.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentResult.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
                state.isTaken = true
            })
            .addCase(fetchStudentResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });

        // fetch all quiz results
        builder
            .addCase(fetchQuizResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizResults.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchQuizResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";

            });
        // fetch student answer
        builder
            .addCase(fetchStudentAnswer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentAnswer.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
            })
            .addCase(fetchStudentAnswer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";

            });
    },
});

export default quizSlice.reducer;
