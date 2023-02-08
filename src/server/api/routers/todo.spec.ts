import { TRPCError, type inferProcedureInput } from "@trpc/server";
import { appRouter, type AppRouter } from "../root";
import { createInnerTRPCContext } from "../trpc";
import { expect, test } from "vitest";

test("Creating a todo", async () => {
  const ctx = createInnerTRPCContext({});
  const caller = appRouter.createCaller(ctx);

  type Input = inferProcedureInput<AppRouter["todo"]["createTodo"]>;
  const input: Input = {
    title: "test",
  };

  const todo = await caller.todo.createTodo(input);

  expect(todo).toMatchObject({ title: "test" });
});

test("Should not allow creating a todo", async () => {
  const ctx = createInnerTRPCContext({});
  const caller = appRouter.createCaller(ctx);

  type Input = inferProcedureInput<AppRouter["todo"]["createTodo"]>;
  const input: Input = {
    example: "test",
  };

  await expect(caller.todo.createTodo(input)).rejects.toBeInstanceOf(TRPCError);
});

test("Updating a todo", async () => {
  const ctx = createInnerTRPCContext({});
  const caller = appRouter.createCaller(ctx);

  type Input = inferProcedureInput<AppRouter["todo"]["createTodo"]>;
  type UpdateInput = inferProcedureInput<AppRouter["todo"]["updateTodo"]>;
  const input: Input = {
    title: "test",
  };

  const todo = await caller.todo.createTodo(input);

  const updatedInput: UpdateInput = {
    id: todo.id,
    data: {
      completed: true,
    },
  };

  const updatedTodo = await caller.todo.updateTodo(updatedInput);

  expect(updatedTodo).toMatchObject({ title: "test", completed: true });
});

test("Should not update a nonexistent todo", async () => {
  const ctx = createInnerTRPCContext({});
  const caller = appRouter.createCaller(ctx);

  type UpdateInput = inferProcedureInput<AppRouter["todo"]["updateTodo"]>;

  const updatedInput: UpdateInput = {
    id: "1231231",
    data: {
      completed: true,
    },
  };

  await expect(caller.todo.updateTodo(updatedInput)).rejects.toBeInstanceOf(
    TRPCError
  );
});

test("Should be able to list todos", async () => {
  const ctx = createInnerTRPCContext({});
  const caller = appRouter.createCaller(ctx);

  type Input = inferProcedureInput<AppRouter["todo"]["createTodo"]>;
  const input: Input = {
    title: "test",
  };

  await caller.todo.createTodo(input);

  const todos = await caller.todo.getAllTodos();

  expect(todos.length).greaterThan(0);
});