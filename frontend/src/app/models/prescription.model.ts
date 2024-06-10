export class Prescription {

  id?: number;
  recommendation: string;

  constructor(recommendation: string) {
    this.recommendation = recommendation;
  }
}
