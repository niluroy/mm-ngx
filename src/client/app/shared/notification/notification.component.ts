import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../chat/socket.service';
import { Notification } from '../database/notification';
import { UserDetails } from '../database/user-details';
import { SharedService } from '../services/shared.service';
import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'mm-notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.css']
})

export class NotificationComponent implements OnInit, OnDestroy {

    notification: Notification;
    @Input() selectedUser: UserDetails;
    @ViewChild('alert') alert: ElementRef;
    private unsubscribeObservables = new Subject();

    constructor(private socketService: SocketService, private router: Router, private sharedService: SharedService) {}

    ngOnInit() {
        if(this.selectedUser) {
            this.getNotification();
            // this.consultationStatus();
        }
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    getNotification() {
        this.socketService.consultNotification()
        .takeUntil(this.unsubscribeObservables)
            .subscribe((data) => {
                if (data) {
                    this.notification = data.notification;
                    this.alert.nativeElement.style.display = 'block';
                    console.log('Notification data for rectangle slider notification');
                    console.log(data);
                    this.sharedService.createWebNotification('Scheduled Consultation','Patient waiting for you to join the consultation');
                }
            });
    }

    dismissNotification() {
        this.alert.nativeElement.style.display = 'none';
    }

    startConsultation(notification: Notification) {
        this.socketService.userAdded(this.selectedUser, notification);
    }
    // coomented this as the same method exists in navbar and i hope it works fine even without this method
    // consultationStatus() {
    //     this.socketService.receiveUserAdded()
    //         .subscribe((response) => {
    //             console.log('received user added in notification comp');
    //             this.router.navigate([`/chat/${response.doctorId}`]);
    //         });
    // }
}
