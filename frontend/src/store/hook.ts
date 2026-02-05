// src/store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Hook typé pour dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Hook typé pour selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
