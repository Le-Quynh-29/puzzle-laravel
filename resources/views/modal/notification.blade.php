<div class="modal fade" id="modal-notification" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ $title_header }}</h5>
                <button type="button" class="close close-modal" data-coreui-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body text-start">{{ $content }}</div>
            <div class="modal-footer">
                <div class="text-right">
                    <button type="submit" class="btn btn-primary close-modal"> OK </button>
                </div>
            </div>
        </div>
    </div>
</div>

