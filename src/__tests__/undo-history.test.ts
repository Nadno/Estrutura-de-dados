import { describe, expect, it } from 'vitest';
import { UndoHistory } from '../utils/undo-history';

type ToolActions = 'zoom-in' | 'zoom-out';

describe('Util UndoHistory', () => {
  const actionSet = ['zoom-in', 'zoom-in', 'zoom-out'] as const;

  it('should push and peek the actions', () => {
    const toolHistory = new UndoHistory<ToolActions>();

    expect(toolHistory.peek()).toBeUndefined();

    actionSet.forEach((action) => {
      toolHistory.push(action);
      expect(toolHistory.peek()).toBe(action);
    });
  });

  it('should undo the action', () => {
    const toolHistory = new UndoHistory<ToolActions>();

    toolHistory.push(...actionSet);

    expect(toolHistory.undo()).toBe('zoom-out');
    expect(toolHistory.peek()).toBe('zoom-in');
    expect(toolHistory.undo()).toBe('zoom-in');
    expect(toolHistory.peek()).toBe('zoom-in');
    expect(toolHistory.undo()).toBe('zoom-in');
    expect(toolHistory.peek()).toBeUndefined();
  });

  it('should redo the action', () => {
    const toolHistory = new UndoHistory<ToolActions>();

    toolHistory.push(...actionSet);
    toolHistory.undo();
    toolHistory.undo();
    toolHistory.undo();

    expect(toolHistory.peek()).toBeUndefined();
    expect(toolHistory.redo()).toBe('zoom-in');
    expect(toolHistory.redo()).toBe('zoom-in');
    expect(toolHistory.redo()).toBe('zoom-out');
  });

  it('should supply a `clear` method to clear the done an undone history', () => {
    const toolHistory = new UndoHistory<ToolActions>();
    toolHistory.push(...actionSet);
    toolHistory.undo();

    expect([...toolHistory.doneValues(), ...toolHistory.undoneValues()]).toEqual(actionSet);

    toolHistory.clear();

    expect([...toolHistory.doneValues(), ...toolHistory.undoneValues()]).toHaveProperty(
      'length',
      0,
    );
  });

  it('should supply an `isEmpty` property', () => {
    const toolHistory = new UndoHistory<ToolActions>();
    expect(toolHistory.isEmpty).toBe(true);

    actionSet.forEach((action) => {
      toolHistory.push(action);
      expect(toolHistory.isEmpty).toBe(false);
    });

    actionSet.forEach(() => {
      toolHistory.undo();
      expect(toolHistory.isEmpty).toBe(false);
    });

    actionSet.forEach(() => {
      toolHistory.redo();
      expect(toolHistory.isEmpty).toBe(false);
    });

    toolHistory.clear();

    expect(toolHistory.isEmpty).toBe(true);
  });

  it('should supply a `can` method that tells us if we can undo or redo actions', () => {
    const toolHistory = new UndoHistory<ToolActions>();

    expect(toolHistory.can('undo')).toBe(false);
    expect(toolHistory.can('redo')).toBe(false);

    toolHistory.push('zoom-in');

    expect(toolHistory.peek()).toBe('zoom-in');
    expect(toolHistory.can('undo')).toBe(true);
    expect(toolHistory.can('redo')).toBe(false);

    toolHistory.push('zoom-in');
    toolHistory.push('zoom-out');

    toolHistory.undo();

    expect(toolHistory.peek()).toBe('zoom-in');
    expect(toolHistory.can('undo')).toBe(true);
    expect(toolHistory.can('redo')).toBe(true);

    toolHistory.redo();

    expect(toolHistory.peek()).toBe('zoom-out');
    expect(toolHistory.can('undo')).toBe(true);
    expect(toolHistory.can('redo')).toBe(false);

    toolHistory.undo();
    toolHistory.undo();
    toolHistory.undo();

    expect(toolHistory.peek()).toBeUndefined();
    expect(toolHistory.can('undo')).toBe(false);
    expect(toolHistory.can('redo')).toBe(true);
  });
});
