import { useMutation } from '@tanstack/react-query';
import api from '../lib/axios';

export const useScoreResume = () => {
  return useMutation({
    mutationFn: async ({ resumeId, jobDescription }) => {
      const { data } = await api.post(`/ai/score/${resumeId}`, { jobDescription });
      return data.data;
    },
  });
};

export const useInterviewQuestions = () => {
  return useMutation({
    mutationFn: async ({ resumeId, jobDescription }) => {
      const { data } = await api.post(`/ai/interview-prep/${resumeId}`, { jobDescription });
      return data.data;
    },
  });
};