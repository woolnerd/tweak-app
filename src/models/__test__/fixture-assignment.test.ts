import * as mock from "../__mocks__/fixture-assignment.mock";
import FixtureAssignment from "../fixture-assignment";

import { TableNames } from "@/db/types/tables";

describe("Fixture Assignment Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new fixture assignment", async () => {
    const { mockInsertDb, mockFixtureAssignment } = mock;

    const result = await new FixtureAssignment(mockInsertDb).create(mockFixtureAssignment);
    expect(mockInsertDb.insert).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockFixtureAssignment);
  });

  test("should get all fixture assignments", async () => {
    const { mockGetAllDb, mockFixtureAssignmentArray } = mock;

    const result = await new FixtureAssignment(mockGetAllDb).getAll();

    expect(result).toEqual(mockFixtureAssignmentArray);
    expect(mockGetAllDb.query[TableNames.FixtureAssignments].findMany).toHaveBeenCalledTimes(1);
  });

  test("should get fixture assignment by it's id", async () => {
    const { mockGetByIdDb, mockFixtureAssignment } = mock;

    await expect(
      new FixtureAssignment(mockGetByIdDb).getById(mockFixtureAssignment.id),
    ).resolves.toEqual(mockFixtureAssignment);
    expect(mockGetByIdDb.where).toHaveBeenCalledTimes(1);
  });

  test("should update a fixture assignment", async () => {
    const { mockUpdateDb, mockFixtureAssignment } = mock;

    await expect(
      new FixtureAssignment(mockUpdateDb).update(mockFixtureAssignment),
    ).resolves.toEqual(mockFixtureAssignment);

    expect(mockUpdateDb.update).toHaveBeenCalledTimes(1);
  });

  test("deleteFixtureAssignment", async () => {
    const { mockDeleteDb, mockFixtureAssignment } = mock;

    const assignmentId = 1;

    const result = await new FixtureAssignment(mockDeleteDb).delete(assignmentId);

    expect(result).toEqual(mockFixtureAssignment);
    expect(mockDeleteDb.where).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.returning).toHaveBeenCalledTimes(1);
  });
});
