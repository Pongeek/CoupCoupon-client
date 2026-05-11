import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

/**
 * Typed version of useDispatch — use this instead of plain useDispatch
 * throughout the app for proper type inference on dispatched actions.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of useSelector — use this instead of plain useSelector
 * throughout the app for proper type inference on selected state.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
