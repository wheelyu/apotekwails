export namespace backend {
	
	export class UserDetail {
	    id: number;
	    name: string;
	    email: string;
	    role: string;
	    token: string;
	
	    static createFrom(source: any = {}) {
	        return new UserDetail(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.email = source["email"];
	        this.role = source["role"];
	        this.token = source["token"];
	    }
	}
	export class LoginResponse {
	    success: boolean;
	    message: string;
	    user?: UserDetail;
	
	    static createFrom(source: any = {}) {
	        return new LoginResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.user = this.convertValues(source["user"], UserDetail);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PaginatedPatients {
	    data: models.Patient[];
	    page: number;
	    page_size: number;
	    total_rows: number;
	    total_all_rows: number;
	    total_pages: number;
	    activePatient: number;
	
	    static createFrom(source: any = {}) {
	        return new PaginatedPatients(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], models.Patient);
	        this.page = source["page"];
	        this.page_size = source["page_size"];
	        this.total_rows = source["total_rows"];
	        this.total_all_rows = source["total_all_rows"];
	        this.total_pages = source["total_pages"];
	        this.activePatient = source["activePatient"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PaginationParams {
	    page: number;
	    pageSize: number;
	    name: string;
	    address: string;
	    code: string;
	    nik: string;
	    phone: string;
	
	    static createFrom(source: any = {}) {
	        return new PaginationParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.page = source["page"];
	        this.pageSize = source["pageSize"];
	        this.name = source["name"];
	        this.address = source["address"];
	        this.code = source["code"];
	        this.nik = source["nik"];
	        this.phone = source["phone"];
	    }
	}
	export class PatientTotal {
	    Total: number;
	    TotalVisit: number;
	    TotalPatientNew: number;
	
	    static createFrom(source: any = {}) {
	        return new PatientTotal(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Total = source["Total"];
	        this.TotalVisit = source["TotalVisit"];
	        this.TotalPatientNew = source["TotalPatientNew"];
	    }
	}

}

export namespace models {
	
	export class CreateInput {
	    nik?: string;
	    name: string;
	    gender: string;
	    date_of_birth: string;
	    phone: string;
	    address: string;
	    blood_type: string;
	    allergies: string;
	    status: boolean;
	    religion: string;
	    occupation: string;
	    emergency_contact_name: string;
	    emergency_contact_phone: string;
	    insurance_provider: string;
	    insurance_number: string;
	
	    static createFrom(source: any = {}) {
	        return new CreateInput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.nik = source["nik"];
	        this.name = source["name"];
	        this.gender = source["gender"];
	        this.date_of_birth = source["date_of_birth"];
	        this.phone = source["phone"];
	        this.address = source["address"];
	        this.blood_type = source["blood_type"];
	        this.allergies = source["allergies"];
	        this.status = source["status"];
	        this.religion = source["religion"];
	        this.occupation = source["occupation"];
	        this.emergency_contact_name = source["emergency_contact_name"];
	        this.emergency_contact_phone = source["emergency_contact_phone"];
	        this.insurance_provider = source["insurance_provider"];
	        this.insurance_number = source["insurance_number"];
	    }
	}
	export class User {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    Name: string;
	    Email: string;
	    Password: string;
	    Phone: string;
	    gender: string;
	    date_of_birth: string;
	    Role: string;
	    Token: string;
	
	    static createFrom(source: any = {}) {
	        return new User(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.Name = source["Name"];
	        this.Email = source["Email"];
	        this.Password = source["Password"];
	        this.Phone = source["Phone"];
	        this.gender = source["gender"];
	        this.date_of_birth = source["date_of_birth"];
	        this.Role = source["Role"];
	        this.Token = source["Token"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Doctor {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    user_id: number;
	    user: User;
	    doctor_code: string;
	    fullname: string;
	    specialization: string;
	    gender: string;
	    phone_number: string;
	    email: string;
	    address: string;
	    schedule_days: string;
	    start_time: string;
	    end_time: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new Doctor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.user_id = source["user_id"];
	        this.user = this.convertValues(source["user"], User);
	        this.doctor_code = source["doctor_code"];
	        this.fullname = source["fullname"];
	        this.specialization = source["specialization"];
	        this.gender = source["gender"];
	        this.phone_number = source["phone_number"];
	        this.email = source["email"];
	        this.address = source["address"];
	        this.schedule_days = source["schedule_days"];
	        this.start_time = source["start_time"];
	        this.end_time = source["end_time"];
	        this.status = source["status"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Patient {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    code: string;
	    nik?: string;
	    name: string;
	    gender: string;
	    date_of_birth: string;
	    phone: string;
	    address: string;
	    blood_type: string;
	    allergies: string;
	    status: boolean;
	    religion: string;
	    occupation: string;
	    emergency_contact_name: string;
	    emergency_contact_phone: string;
	    insurance_provider: string;
	    insurance_number: string;
	
	    static createFrom(source: any = {}) {
	        return new Patient(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.code = source["code"];
	        this.nik = source["nik"];
	        this.name = source["name"];
	        this.gender = source["gender"];
	        this.date_of_birth = source["date_of_birth"];
	        this.phone = source["phone"];
	        this.address = source["address"];
	        this.blood_type = source["blood_type"];
	        this.allergies = source["allergies"];
	        this.status = source["status"];
	        this.religion = source["religion"];
	        this.occupation = source["occupation"];
	        this.emergency_contact_name = source["emergency_contact_name"];
	        this.emergency_contact_phone = source["emergency_contact_phone"];
	        this.insurance_provider = source["insurance_provider"];
	        this.insurance_number = source["insurance_number"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Visit {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    patient_id: number;
	    patient?: Patient;
	    doctor_id: number;
	    doctor?: Doctor;
	    // Go type: time
	    visit_date: any;
	    visit_time: string;
	    department: string;
	    complaint: string;
	    queue_number: number;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new Visit(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.patient_id = source["patient_id"];
	        this.patient = this.convertValues(source["patient"], Patient);
	        this.doctor_id = source["doctor_id"];
	        this.doctor = this.convertValues(source["doctor"], Doctor);
	        this.visit_date = this.convertValues(source["visit_date"], null);
	        this.visit_time = source["visit_time"];
	        this.department = source["department"];
	        this.complaint = source["complaint"];
	        this.queue_number = source["queue_number"];
	        this.status = source["status"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

