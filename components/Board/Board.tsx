'use client';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useEffect, useRef } from 'react';
import type { CreateTypes } from 'canvas-confetti';
import Column from '../Column/Column';
import TaskCard from '../TaskCard/TaskCard';
import useBoard, { UseBoardProps } from './useBoard';

export default function Board(props: UseBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<CreateTypes | null>(null);

  useEffect(() => {
    if (!boardRef.current) return;
    let canceled = false;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    boardRef.current.appendChild(canvas);

    import('canvas-confetti').then(module => {
      if (canceled) return;
      confettiRef.current = module.create(canvas, {
        resize: true,
        useWorker: true,
      });
    });

    return () => {
      canceled = true;
      confettiRef.current = null;
      canvas.remove();
    };
  }, []);

  const celebrate = () => {
    confettiRef.current?.({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const { state, actions, helpers } = useBoard({ ...props, onDone: celebrate });
  const { sensors, activeTask, columns } = state;
  const { getTasks, handleDragStart, handleDragOver, handleDragEnd } = actions;
  const { closestCorners } = helpers;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div ref={boardRef} className="relative overflow-hidden">
        <div className="flex gap-4 overflow-x-auto p-4 touch-pan-x snap-x snap-mandatory relative z-10">
          {columns.map(col => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={getTasks(col.id)}
              mode={props.mode}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            dragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
