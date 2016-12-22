<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class link_requests
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $link_request_type;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $sender_msg;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $is_confirmed;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $request_msg;

    /**
     * @ORM\OneToMany(targetEntity="Entities\wall_post", mappedBy="wall_postsLink_request")
     */
    private $link_requestsWall_post;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="senderUsersLink_requests")
     * @ORM\JoinColumn(name="request_user_id", referencedColumnName="id", nullable=false)
     */
    private $link_requestsSenderUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="recieverUsersLink_request")
     * @ORM\JoinColumn(name="accept_user_id", referencedColumnName="id", nullable=false)
     */
    private $link_requestsRecieverUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getLink_request_type() {
		return $this->link_request_type;
	}

	public function setLink_request_type($link_request_type) {
		$this->link_request_type = $link_request_type;
	}

	public function getSender_msg() {
		return $this->sender_msg;
	}

	public function setSender_msg($sender_msg) {
		$this->sender_msg = $sender_msg;
	}

	public function getIs_confirmed() {
		return $this->is_confirmed;
	}

	public function setIs_confirmed($is_confirmed) {
		$this->is_confirmed = $is_confirmed;
	}

	public function getRequest_msg() {
		return $this->request_msg;
	}

	public function setRequest_msg($request_msg) {
		$this->request_msg = $request_msg;
	}

	public function getLink_requestsWall_post() {
		return $this->link_requestsWall_post;
	}

	public function setLink_requestsWall_post($link_requestsWall_post) {
		$this->link_requestsWall_post = $link_requestsWall_post;
	}

	public function getLink_requestsSenderUser() {
		return $this->link_requestsSenderUser;
	}

	public function setLink_requestsSenderUser($link_requestsSenderUser) {
		$this->link_requestsSenderUser = $link_requestsSenderUser;
	}

	public function getLink_requestsRecieverUser() {
		return $this->link_requestsRecieverUser;
	}

	public function setLink_requestsRecieverUser($link_requestsRecieverUser) {
		$this->link_requestsRecieverUser = $link_requestsRecieverUser;
	}

}