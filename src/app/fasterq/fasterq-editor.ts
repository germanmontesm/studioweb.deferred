import {Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, ChangeDetectorRef, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Observable} from "rxjs/Observable";
import {FasterqQueueModel} from "../../models/fasterq-queue-model";
import {Map, List} from 'immutable';
import * as _ from 'lodash';
import {Lib} from "../../Lib";
import {FasterqLineModel} from "../../models/fasterq-line-model";
import {FasterqAnalyticsModel} from "../../models/fasterq-analytics";

@Component({
    selector: 'fasterq-editor',
    styles: [`
        .personInLine {
            margin: 10px;
            padding: 0;
            float: left;
            width: 40px;
            height: 100px;
            cursor: pointer;
            color: #D0D0D0;
        }

        .called {
            color: #BE6734;
        }

        .serviced {
            color: #ACFD89;
        }
    `],
    templateUrl: './fasterq-editor.html'
})
export class FasterqEditor extends Compbaser implements AfterViewInit {

    QUEUE_OFFSET = 8;
    m_gotoModel = 0;
    m_stopWatchHandle: any = new Stopwatch();
    m_stopTimer = '00:00:00';
    m_selectedQueue: FasterqQueueModel;
    m_line: FasterqLineModel;
    m_queues: List<FasterqQueueModel> = List([]);
    m_analytics: List<FasterqAnalyticsModel> = List([]);
    m_offsetPosition = 0;

    constructor(private yp: YellowPepperService, private el: ElementRef, private cd: ChangeDetectorRef) {
        super();

        this.cancelOnDestroy(
            this.yp.listenFasterqLineSelected()
                .subscribe((i_line: FasterqLineModel) => {
                    this.m_line = i_line;
                    this.cd.markForCheck();
                }, (e) => console.error(e))
        )

        this.cancelOnDestroy(
            this.yp.listenFasterqQueues()
                .subscribe((i_queues: List<FasterqQueueModel>) => {
                    this.m_selectedQueue = i_queues.get(0);
                    this.m_queues = List([]);
                    for (var i = (0 - this.QUEUE_OFFSET); i < 0; i++) {
                        i_queues = i_queues.unshift(new FasterqQueueModel({line_id: -1}))
                    }
                    this.m_queues = i_queues;
                    this.cd.markForCheck();
                }, (e) => console.error(e))
        )

        this.cancelOnDestroy(
            this.yp.listenFasterqAnalytics()
                .subscribe((i_analytics: List<FasterqAnalyticsModel>) => {
                    this.m_analytics = i_analytics;
                    this.cd.markForCheck();
                }, (e) => console.error(e))
        )
    }

    _onQueueSelected(i_queue: FasterqQueueModel) {
        this.m_selectedQueue = i_queue;
        var index = this._getQueueIndex();
        this._scrollTo(index);
    }

    _getQueueIndex(): number {
        if (!this.m_selectedQueue)
            return -1;
        return this.m_queues.findIndex((i_fasterqQueueModel) => {
            return i_fasterqQueueModel == this.m_selectedQueue
        })
    }

    /**
     Scroll to position of selected queue / UI person
     @method _scrollTo
     @param {Element} i_element
     **/
    _scrollTo(i_index) {
        this._watchStop();
        var el = $('#fqLineQueueComponent', this.el.nativeElement).children().eq(i_index);

        // if (i_element.length == 0)
        //     return;
        // this.m_selectedServiceID = $(i_element, this.el.nativeElement).data('service_id');
        // var model = self.m_queuesCollection.where({'service_id': self.m_selectedServiceID})[0];
        // self._populatePropsQueue(model);
        //
        var scrollXPos = $(el).position().left;
        // console.log('current offset ' + scrollXPos + ' ' + 'going to index ' + $(i_element).index() + ' service_id ' + i_serviceId);
        this.m_offsetPosition = $('#fqLineQueueComponentContainer', this.el.nativeElement).scrollLeft();
        scrollXPos += this.m_offsetPosition;
        var final = scrollXPos - 480;
        TweenLite.to('#fqLineQueueComponentContainer', 2, {
            scrollTo: {x: final, y: 0},
            ease: Power4['easeOut']
        });
    }

    /**
     Listen to queue being called, mark on UI and post to server
     @method _listenCalled
     **/
    _onCall() {
        //     var model = self.m_queuesCollection.where({'service_id': self.m_selectedServiceID})[0];
        //     if (_.isUndefined(model))
        //         return;
        if (!_.isNull(this.m_selectedQueue.serviced))
            return bootbox.alert('customer has already been serviced');

        this._watchStart();
        //     var elem = self.$('[data-service_id="' + (self.m_selectedServiceID) + '"]');
        //     $(elem).find('i').fadeOut(function () {
        //         $(this).css({color: '#BE6734'}).fadeIn();
        //     });
        //     $(Elements.FQ_LAST_CALLED).text(self.m_selectedServiceID);
        //     var d = new XDate();
        //     model.set('called', d.toString('M/d/yyyy hh:mm:ss TT'));
        //     model.set('called_by', pepper.getUserData().userName);
        //     model.set('called_by_override', false);
        //
        //     self._populatePropsQueue(model);
        //
        //     model.save(null, {
        //         success: (function (model, data) {
        //             if (data.updated == 'alreadyCalled') {
        //                 bootbox.confirm('Customer already called by user' + data.called_by + ' <br/><br/>Would you like to call the customer again?', function (result) {
        //                     if (result) {
        //                         model.set('called_by_override', true);
        //                         model.save();
        //                     }
        //                 });
        //             }
        //         }),
        //         error: (function (e) {
        //             bootbox.alert('Service request failure: ' + e);
        //         }),
        //         complete: (function (e) {
        //         })
        //     });
    }

    /**
     Listen to queue being serviced, mark on UI and post to server
     @method _listenServiced
     **/
    _onService() {
        // var self = this;
        // $(Elements.FQ_LINE_COMP_SERVICED).on('click', function () {
        //     self._watchStop();
        //     var model = self.m_queuesCollection.where({'service_id': self.m_selectedServiceID})[0];
        //     if (_.isUndefined(model))
        //         return;
        //     if (_.isNull(model.get('called'))) {
        //         bootbox.alert('customer has not been called yet');
        //         return;
        //     }
        //     if (!_.isNull(model.get('serviced'))) {
        //         bootbox.alert('customer has already been serviced');
        //         return;
        //     }
        //     var elem = self.$('[data-service_id="' + (self.m_selectedServiceID) + '"]');
        //     $(elem).find('i').fadeOut(function () {
        //         $(this).css({color: '#ACFD89'}).fadeIn();
        //     });
        //     $(Elements.FQ_LAST_SERVICED).text(self.m_selectedServiceID);
        //     var d = new XDate();
        //     model.set('serviced', d.toString('M/d/yyyy hh:mm:ss TT'));
        //     log('service ' + model.get('serviced'));
        //     model.save({
        //         success: (function (model, data) {
        //             log(model);
        //         }),
        //         error: (function (e) {
        //             log('Service request failure: ' + e);
        //         }),
        //         complete: (function (e) {
        //         })
        //     });
        // });
    }

    _onPrev() {
        if (this._getQueueIndex() == this.QUEUE_OFFSET)
            return;
        var index = this._getQueueIndex() - 1;
        this.m_selectedQueue = this.m_queues.get(this._getQueueIndex() - 1)
        this._scrollTo(index)
    }

    _onNext() {
        if (this._getQueueIndex() + 1 == this.m_queues.size || this.m_queues.size <= this.QUEUE_OFFSET + 1)
            return;
        if (this._getQueueIndex() == -1)
            this.m_selectedQueue = this.m_queues.get(this.QUEUE_OFFSET)
        var index = this._getQueueIndex() + 1;
        this.m_selectedQueue = this.m_queues.get(this._getQueueIndex() + 1)
        this._scrollTo(index);
    }

    _onGoTo() {
        var queue = this.m_queues.find((i_fasterqQueueModel: FasterqQueueModel) => {
            var serviceId = i_fasterqQueueModel.serviceId;
            var selectedId = Lib.PadZeros(this.m_gotoModel, 3, 0);
            return serviceId == selectedId;
        })
        if (queue) {
            this.m_selectedQueue = queue;
            this._scrollTo(this._getQueueIndex());
        }


        // if (goto <= this.QUEUE_OFFSET)
        //     return;
        // if (goto >= this.m_queues.size + 1)
        //     return;
        // this._scrollTo(goto);
    }

    /**
     Start the stop watch UI
     @method _watchStart
     **/
    _watchStart() {
        this.m_stopWatchHandle.setListener((e) => {
            this.m_stopTimer = this.m_stopWatchHandle.toString();
        });
        this.m_stopWatchHandle.start();
    }

    /**
     Stop the stop watch UI
     @method _watchStop
     **/
    _watchStop() {
        this.m_stopWatchHandle.stop();
        this.m_stopWatchHandle.reset();
        this.m_stopTimer = '00:00:00';
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}