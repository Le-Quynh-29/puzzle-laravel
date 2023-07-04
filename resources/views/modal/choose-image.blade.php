<div class="modal fade" id="modal-confirm" tabindex="-1" role="dialog" aria-labelledby="modal-confirm" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ $title_header }}</h5>
                <button type="button" class="close cancel" data-coreui-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">{{ $content }}</div>
            <div class="modal-footer">
                <div class="text-right">
                    <button type="button" class="btn btn-secondary cancel" data-coreui-dismiss="modal"> {{ $title_cancel }} </button>
                    <button type="submit" class="btn btn-primary btn-modal-save"> {{ $title_save }} </button>
                </div>
            </div>
        </div>
    </div>
</div>
