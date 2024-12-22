module wallpaper::wallpaper {

    use std::string::String;
    use sui::display::{Self};
    use sui::event;
    use sui::package::{Self};
    use wallpaper::utils::{Self};

    const LIBRARY_VISUALIZATION_SITE: address = @0xc74ed4dc6a2dd4659beb39396d3b10289557e0e52b0f2dddafc165dea95607cb;

    const EAlreadyExists: u64 = 0;

    public struct State has key, store {
        id: UID,
        libraries: vector<address>
    }

    public struct BlobLibrary has key {
        id: UID,
        name: vector<u8>,
        owner: address,
        b36addr: String,
        blobs: vector<String>
    }

    public struct AddLibrary has copy, drop {
        id: ID,
        name: vector<u8>,
        owner: address,
        b36addr: String,
    }

    public struct AddBlob has copy, drop {
        library_id: ID,
        owner: address,
        blob: String,
    }

    public struct WALLPAPER has drop {}

    fun init(otw: WALLPAPER, ctx: &mut TxContext) {
        let sender = ctx.sender();
        let publisher = package::claim(otw, ctx);
        let mut site_display = display::new<BlobLibrary>(&publisher, ctx);

        site_display.add(
            b"link".to_string(),
            b"https://{b36addr}.walrus.site".to_string(),
        );

        site_display.add(
            b"walrus site address".to_string(),
            LIBRARY_VISUALIZATION_SITE.to_string(),
        );

        let gallery_site = State {
            id: object::new(ctx),
            libraries: vector::empty(),
        };

        transfer::public_share_object(gallery_site);
        transfer::public_transfer(publisher, sender);
        transfer::public_transfer(site_display, sender);
    }

    public entry fun create(state: &mut State, name: vector<u8>, ctx: &mut TxContext) {
        let sender = ctx.sender();
        let id = object::new(ctx);
        let object_address = object::uid_to_address(&id);
        let b36addr = utils::to_b36(object_address);
        let event_id = object::uid_to_inner(&id);

        let blob_library = BlobLibrary {
            id,
            name,
            owner: sender,
            b36addr,
            blobs: vector::empty(),
        };

        vector::push_back(&mut state.libraries, object_address);

        transfer::transfer(blob_library, sender);

        event::emit(AddLibrary {
            id: event_id,
            name,
            owner: sender,
            b36addr,
        });
    }

    public entry fun add_blob(library: &mut BlobLibrary, blob: String, ctx: &TxContext) {
        assert!(!vector::contains(&library.blobs, &blob), EAlreadyExists);
        let sender = ctx.sender();
        vector::push_back(&mut library.blobs, blob);
        let library_id = object::uid_to_inner(&library.id);
        event::emit(AddBlob {
            library_id,
            blob,
            owner: sender,
        });
    }
}