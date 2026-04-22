import { beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSeoMeta } from "./useSeoMeta";

describe("useSeoMeta", () => {
  beforeEach(() => {
    document.title = "";
    document.head.innerHTML = "";
  });

  it("sets document title and creates meta description", () => {
    renderHook(() =>
      useSeoMeta({
        title: "Test Title",
        description: "Test Description",
      }),
    );

    expect(document.title).toBe("Test Title");

    const meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement;

    expect(meta).toBeTruthy();
    expect(meta.content).toBe("Test Description");
  });

  it("updates document title and meta description on rerender", () => {
    const { rerender } = renderHook(
      ({ title, description }) => useSeoMeta({ title, description }),
      {
        initialProps: {
          title: "Initial Title",
          description: "Initial Description",
        },
      },
    );

    expect(document.title).toBe("Initial Title");

    rerender({
      title: "Updated Title",
      description: "Updated Description",
    });

    expect(document.title).toBe("Updated Title");

    const meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement;

    expect(meta.content).toBe("Updated Description");
  });

  it("creates meta tag if it does not exist", () => {
    renderHook(() =>
      useSeoMeta({
        title: "Another Title",
        description: "Another Description",
      }),
    );

    const metas = document.querySelectorAll('meta[name="description"]');

    expect(metas.length).toBe(1);
    expect(metas[0]!.getAttribute("name")).toBe("description");
  });
});
