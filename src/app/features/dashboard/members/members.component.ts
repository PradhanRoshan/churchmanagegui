import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistrationTracking, UserMember } from '../../../core/model/registration-tracking.model';
import { MembersService } from '../../../core/services/members.service';

interface User {
  name: string;
  status: string;
  role: string;
  email: string;
  signup: string;
  userId: number;
  image: string;
}

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [FormsModule,NgIf, NgFor, NgClass],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {


  searchText: string = '';
  selectedStatus: string = '';
  selectedRole: string = '';
  sortColumn: string = '';
  sortAscending: boolean = true;
  currentPage: number = 1;

  // Default page size and available options
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  registredMembers: RegistrationTracking[] = [];

  constructor(private membersService: MembersService) {

  }

  ngOnInit(): void {

    this.refreshRegTrackingData();

  }

  refreshRegTrackingData() {
    this.membersService.getRegistrationTracking().subscribe((data: RegistrationTracking[]) => {
      this.registredMembers = data;
      console.log('Data fetched:', this.registredMembers);
      // this.fetchData('new');   
    });


  }

  getFullName(data: UserMember) {
    let middleName = data.middleName != null ? data.middleName : "";
    return data.firstName + " " + middleName + data.lastName;
  }

    // Sorting function
    sortTable(column: string) {
      if (this.sortColumn === column) {
        this.sortAscending = !this.sortAscending;
      } else {
        this.sortColumn = column;
        this.sortAscending = true;
      }
  
      this.registredMembers.sort((a, b) => {
        const valueA = this.getColumnValue(a, column);
        const valueB = this.getColumnValue(b, column);
  
        return this.sortAscending
          ? valueA.toString().localeCompare(valueB.toString())
          : valueB.toString().localeCompare(valueA.toString());
      });
    }


  // Extract the correct column value
  getColumnValue(user: RegistrationTracking, column: string): string {
    switch (column) {
      case 'memberId':
        return user.userMember.memberId;
      case 'fullName':
        return `${user.userMember.firstName} ${user.userMember.middleName ? user.userMember.middleName + ' ' : ''}${user.userMember.lastName}`;
      case 'email':
        return user.userMember.emailId;
      case 'role':
        return user.role.roleName;
      case 'applicationStatus':
        return user.applicationStatus.statusName;
      case 'memberSince':
        return user.userMember.dttmCreate;
      default:
        return '';
    }
  }


  filteredData(): RegistrationTracking[] {
    return this.registredMembers.filter(user =>
      (!this.selectedStatus || user.applicationStatus.statusName === this.selectedStatus) &&
      (!this.selectedRole || user.role.roleName === this.selectedRole) &&
      Object.values(user.userMember).join(' ').toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


// Hyper-link clicked 
onHyperLinkClicked(member: RegistrationTracking) {
        console.log(member)
   }



  // Check if any filter is applied
isFilterApplied(): boolean {
  return this.searchText.trim() !== '' || this.selectedStatus !== '' || this.selectedRole !== '';
}

// Clear all filters
clearFilters() {
  this.searchText = '';
  this.selectedStatus = '';
  this.selectedRole = '';
}


  paginatedData(): RegistrationTracking[] {
    const filtered = this.filteredData();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredData().length / this.pageSize);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '⇅';
    return this.sortAscending ? '🔼' : '🔽';
  }

  getStatusClass(status: string): string {
    return status === 'Approved' ? 'text-success' : status === 'Rejected' ? 'text-danger' : 'text-warning';
  }
}