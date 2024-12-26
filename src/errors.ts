export class ProjectIdNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectIdNotFoundError";
  }
}
