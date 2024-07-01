export interface Prescription {
    prescriptionId: string;
    patientId:      string;
    doctorId:       string;
    pharmacistId:   string;
    dateIssued:     Date;
    medications:    Medication[];
    notes:          string;
    refill:         Refill;
    encryptedDetails: string;
}

export interface Medication {
    name:      string;
    dosage:    string;
    frequency: string;
    duration:  string;
}

export interface Refill {
    allowed:  boolean;
    quantity: number;
}
