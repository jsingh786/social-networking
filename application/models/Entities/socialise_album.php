<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class socialise_album
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $album_name;

    /**
     * @ORM\Column(type="string", unique=true, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $photo_count;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $comment_count;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $like_count;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $visibility_criteria;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $created_at_timestamp;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $album_display_name;

    /**
     * @ORM\OneToMany(targetEntity="Entities\wall_post", mappedBy="wall_postsSocialise_album", cascade={"remove"})
     */
    private $socialise_albumsWall_post;

    /**
     * @ORM\OneToMany(targetEntity="Entities\likes", mappedBy="likesSocialise_album", cascade={"remove"})
     */
    private $socialise_albumsLike;

    /**
     * @ORM\OneToMany(targetEntity="Entities\share", mappedBy="socialiseAlbum", cascade={"remove"})
     */
    private $share;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Entities\socialise_photo",
     *     mappedBy="socialise_photosSocialise_album",
     *     cascade={"remove"}
     * )
     */
    private $socialise_albumsSocialise_photo;

    /**
     * @ORM\OneToMany(targetEntity="Entities\comments", mappedBy="commentsSocialise_album", cascade={"remove"})
     */
    private $socialise_albumsComment;

    /**
     * @ORM\OneToMany(targetEntity="Entities\socialise_album_custom_privacy", mappedBy="socialiseAlbum")
     */
    private $socialiseAlbumCustomPrivacy;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="ilook_userSocialise_album")
     * @ORM\JoinColumn(name="album_posted_by_user_id", referencedColumnName="id", nullable=false)
     */
    private $socialise_albumIlook_user;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getAlbum_name() {
		return $this->album_name;
	}

	public function setAlbum_name($album_name) {
		$this->album_name = $album_name;
	}

	public function getDescription() {
		return $this->description;
	}

	public function setDescription($description) {
		$this->description = $description;
	}

	public function getPhoto_count() {
		return $this->photo_count;
	}

	public function setPhoto_count($photo_count) {
		$this->photo_count = $photo_count;
	}

	public function getComment_count() {
		return $this->comment_count;
	}

	public function setComment_count($comment_count) {
		$this->comment_count = $comment_count;
	}

	public function getLike_count() {
		return $this->like_count;
	}

	public function setLike_count($like_count) {
		$this->like_count = $like_count;
	}

	public function getVisibility_criteria() {
		return $this->visibility_criteria;
	}

	public function setVisibility_criteria($visibility_criteria) {
		$this->visibility_criteria = $visibility_criteria;
	}

	public function getCreated_at_timestamp() {
		return $this->created_at_timestamp;
	}

	public function setCreated_at_timestamp($created_at_timestamp) {
		$this->created_at_timestamp = $created_at_timestamp;
	}

	public function getAlbum_display_name() {
		return $this->album_display_name;
	}

	public function setAlbum_display_name($album_display_name) {
		$this->album_display_name = $album_display_name;
	}

	public function getSocialise_albumsWall_post() {
		return $this->socialise_albumsWall_post;
	}

	public function setSocialise_albumsWall_post($socialise_albumsWall_post) {
		$this->socialise_albumsWall_post = $socialise_albumsWall_post;
	}

	public function getSocialise_albumsLike() {
		return $this->socialise_albumsLike;
	}

	public function setSocialise_albumsLike($socialise_albumsLike) {
		$this->socialise_albumsLike = $socialise_albumsLike;
	}

	public function getShare() {
		return $this->share;
	}

	public function setShare($share) {
		$this->share = $share;
	}

	public function getSocialise_albumsSocialise_photo() {
		return $this->socialise_albumsSocialise_photo;
	}

	public function setSocialise_albumsSocialise_photo($socialise_albumsSocialise_photo) {
		$this->socialise_albumsSocialise_photo = $socialise_albumsSocialise_photo;
	}

	public function getSocialise_albumsComment() {
		return $this->socialise_albumsComment;
	}

	public function setSocialise_albumsComment($socialise_albumsComment) {
		$this->socialise_albumsComment = $socialise_albumsComment;
	}

	public function getSocialiseAlbumCustomPrivacy() {
		return $this->socialiseAlbumCustomPrivacy;
	}

	public function setSocialiseAlbumCustomPrivacy($socialiseAlbumCustomPrivacy) {
		$this->socialiseAlbumCustomPrivacy = $socialiseAlbumCustomPrivacy;
	}

	public function getSocialise_albumIlook_user() {
		return $this->socialise_albumIlook_user;
	}

	public function setSocialise_albumIlook_user($socialise_albumIlook_user) {
		$this->socialise_albumIlook_user = $socialise_albumIlook_user;
	}

}