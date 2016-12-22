<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class publication
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $publisher;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $publish_date;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $url;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $author;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $activites_and_socities;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $title;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersPublication")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $publicationsUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getPublisher() {
		return $this->publisher;
	}

	public function setPublisher($publisher) {
		$this->publisher = $publisher;
	}

	public function getPublish_date() {
		return $this->publish_date;
	}

	public function setPublish_date($publish_date) {
		$this->publish_date = $publish_date;
	}

	public function getUrl() {
		return $this->url;
	}

	public function setUrl($url) {
		$this->url = $url;
	}

	public function getAuthor() {
		return $this->author;
	}

	public function setAuthor($author) {
		$this->author = $author;
	}

	public function getActivites_and_socities() {
		return $this->activites_and_socities;
	}

	public function setActivites_and_socities($activites_and_socities) {
		$this->activites_and_socities = $activites_and_socities;
	}

	public function getTitle() {
		return $this->title;
	}

	public function setTitle($title) {
		$this->title = $title;
	}

	public function getPublicationsUser() {
		return $this->publicationsUser;
	}

	public function setPublicationsUser($publicationsUser) {
		$this->publicationsUser = $publicationsUser;
	}

}