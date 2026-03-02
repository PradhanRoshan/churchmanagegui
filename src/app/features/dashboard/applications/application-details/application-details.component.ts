import { CommonModule, DatePipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationTracking } from '../../../../core/model/registration-tracking.model';

interface RegistrationComment {
  id: number;
  memberId: string;
  rgstrnRqstCmntRole: string;
  textRgstrnRqstCmnt: string;
  nameRgstrnRqstCmntUser: string;
  timestamp: string;
}

type RegistrationTrackingWithComments = RegistrationTracking & {
  comments?: RegistrationComment[];
};

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationDetailsComponent implements OnInit {
  applicationDetails: RegistrationTracking | null = null;
  memberId: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly datePipe: DatePipe,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    const fromNavigation = (window.history.state as any)?.applicationDetails;
    if (fromNavigation) {
      this.applicationDetails = fromNavigation as RegistrationTracking;
      return;
    }
  }

  goBack(): void {
    if (this.applicationDetails.applicationStatus?.statusName === 'Rejected' || this.applicationDetails.userMember?.applicationSts === 'Rejected') {
      void this.router.navigate(['/dashboard/applications'], { fragment: 'rejected' });
    } else if (this.applicationDetails.applicationStatus?.statusName === 'Approved' || this.applicationDetails.userMember?.applicationSts === 'Approved') {
      void this.router.navigate(['/dashboard/applications'], { fragment: 'approved' });
    }
  }

  get details(): RegistrationTrackingWithComments | null {
    return this.applicationDetails as RegistrationTrackingWithComments | null;
  }

  getApplicationStatusLabel(): string {
    return this.display(this.getApplicationStatusRaw());
  }

  getApplicationStatusBadgeClasses(): string {
    return this.getApplicationStatusBadgeClass(this.getApplicationStatusRaw());
  }

  get comments(): ReadonlyArray<RegistrationComment> {
    return this.details?.comments ?? [];
  }

  get hasComments(): boolean {
    return this.comments.length > 0;
  }

  trackByCommentId(_index: number, comment: RegistrationComment): number {
    return comment.id;
  }

  getMemberFullName(): string {
    const member = this.details?.userMember;
    if (!member) return '—';
    const parts = [member.firstName, member.middleName, member.lastName]
      .map((p) => (typeof p === 'string' ? p.trim() : ''))
      .filter((p) => !!p);
    return parts.length ? parts.join(' ') : '—';
  }

  display(value: unknown): string {
    if (value === null || value === undefined) return '—';
    const text = String(value).trim();
    return text ? text : '—';
  }

  isAdminComment(comment: RegistrationComment): boolean {
    const roleIsAdmin = (comment.rgstrnRqstCmntRole ?? '').toLowerCase() === 'admin';
    if (!roleIsAdmin) return false;

    // Some payloads mark comments as "Admin" even when authored by the applicant.
    // If author matches applicant name, treat as non-admin (left aligned).
    return !this.isApplicantAuthor(comment.nameRgstrnRqstCmntUser);
  }

  private isApplicantAuthor(authorName: string | null | undefined): boolean {
    const author = this.normalizeName(authorName);
    if (!author) return false;

    const member = this.details?.userMember;
    if (!member) return false;

    const first = this.normalizeToken(member.firstName);
    const last = this.normalizeToken(member.lastName);
    if (!first || !last) return false;

    // Match "First Last" or any name containing both first & last tokens.
    return author.includes(first) && author.includes(last);
  }

  private normalizeName(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private normalizeToken(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase();
  }

  getCommentRowClass(comment: RegistrationComment): string {
    return this.isAdminComment(comment) ? 'justify-content-end' : 'justify-content-start';
  }

  getCommentBubbleClass(comment: RegistrationComment): string {
    return this.isAdminComment(comment)
      ? 'bg-transparent border shadow-sm cm-comment-bubble--admin'
      : 'bg-transparent border shadow-sm cm-comment-bubble--other';
  }

  getCommentTimestampClass(_comment: RegistrationComment): string {
    return 'text-muted';
  }

  getCommentAuthorClass(comment: RegistrationComment): string {
    return this.isAdminComment(comment) ? 'cm-comment-author--admin' : 'text-dark';
  }

  getCommentRoleBadgeClass(roleName: string | null | undefined): string {
    const role = (roleName ?? '').toLowerCase();
    if (role === 'admin') return 'cm-comment-role--admin';
    return 'cm-comment-role--other';
  }

  getCommentAvatarClass(comment: RegistrationComment): string {
    return this.isAdminComment(comment) ? 'cm-comment-avatar--admin' : 'cm-comment-avatar--other';
  }

  getInitials(name: string | null | undefined): string {
    const safe = (name ?? '').trim();
    if (!safe) return '?';
    const parts = safe.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') ?? '';
    const initials = (first + last).toUpperCase();
    return initials || '?';
  }

  getRoleBadgeClass(roleName: string | null | undefined): string {
    const role = (roleName ?? '').toLowerCase();
    if (role === 'admin') return 'cm-badge-role--admin';
    return 'cm-badge-role--other';
  }

  getStatusBadgeClass(status: string | null | undefined): string {
    const normalized = (status ?? '').toLowerCase();
    if (normalized === 'active') return 'cm-badge-status--active';
    if (normalized === 'inactive') return 'cm-badge-status--inactive';
    if (normalized === 'blocked') return 'cm-badge-status--blocked';
    return 'cm-badge-status--inactive';
  }

  getApplicationStatusBadgeClass(status: string | null | undefined): string {
    const normalized = (status ?? '').toLowerCase();
    if (normalized === 'approved') return 'cm-badge-app--approved';
    if (normalized === 'pending') return 'cm-badge-app--pending';
    if (normalized === 'rejected' || normalized === 'declined') return 'cm-badge-app--rejected';
    if (normalized === 'in review' || normalized === 'inreview') return 'cm-badge-app--pending';
    return 'cm-badge-app--pending';
  }

  formatDate(value: string | null | undefined): string {
    const parsed = this.parseApiDate(value);
    if (!parsed) return '—';
    return this.datePipe.transform(parsed, 'MMM dd, yyyy') ?? '—';
  }

  formatTimestamp(timestamp: string | null | undefined): string {
    const parsed = this.parseApiDate(timestamp);
    if (!parsed) return '—';
    return this.datePipe.transform(parsed, 'MMM dd, yyyy hh:mm a') ?? '—';
  }

  private getApplicationStatusRaw(): string | null {
    const d = this.details;
    return d?.applicationStatus?.statusName ?? d?.userMember?.applicationSts ?? null;
  }

  private parseApiDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const raw = value.trim();
    if (!raw) return null;

    // yyyy-MM-dd HH:mm:ss -> yyyy-MM-ddTHH:mm:ss
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)) {
      const isoLike = raw.replace(' ', 'T');
      const date = new Date(isoLike);
      return isNaN(date.getTime()) ? null : date;
    }

    // MM-dd-yyyy -> yyyy-MM-dd
    if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
      const [mm, dd, yyyy] = raw.split('-');
      const isoLike = `${yyyy}-${mm}-${dd}`;
      const date = new Date(isoLike);
      return isNaN(date.getTime()) ? null : date;
    }

    // Accept ISO-ish values (yyyy-MM-dd, yyyy-MM-ddTHH:mm:ss, etc.)
    const date = new Date(raw);
    return isNaN(date.getTime()) ? null : date;
  }
}
